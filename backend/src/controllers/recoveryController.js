import bcrypt from 'bcryptjs';
import { setTimeout as delay } from 'node:timers/promises';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { isEmail, validateNewPassword } from '../utils/validation.js';
import { allowRecoveryRequest, generateRecoveryToken, hashRecoveryToken, recoveryLifetime, validRecoveryToken } from '../services/passwordRecovery.js';
import { recoveryMailConfigured, sendRecoveryEmail } from '../services/recoveryMail.js';

const invalidLink = () => new AppError('El enlace no es válido o ha caducado. Solicita uno nuevo.', 400);
export function createRecoveryHandlers({ users = User, allow = allowRecoveryRequest, sendMail = sendRecoveryEmail, configured = recoveryMailConfigured, wait = delay, responseDelay = 6500 } = {}) {
  return {
    forgotPassword: async (req, res) => {
      const email = req.body?.email;
      if (typeof email !== 'string' || !isEmail(email.trim())) throw new AppError('Escribe un email válido.', 400);
      // Configuration errors are independent of whether this account exists.
      if (!configured()) throw new AppError('La recuperación por correo no está disponible temporalmente. Inténtalo más tarde.', 503);
      const started = Date.now();
      const normalized = email.trim().toLowerCase();
      try {
        if (await allow('forgot', normalized, 3)) {
          const token = generateRecoveryToken();
          const tokenHash = hashRecoveryToken(token);
          const user = await users.findOneAndUpdate({ email: normalized, isDemo: { $ne: true } }, { $set: {
            passwordResetTokenHash: tokenHash, passwordResetExpiresAt: new Date(Date.now() + recoveryLifetime),
          } }, { new: true });
          if (user) {
            const sent = await sendMail({ email: user.email, token, language: req.body?.language === 'en' ? 'en' : 'es' });
            if (!sent) await users.updateOne({ _id: user._id, passwordResetTokenHash: tokenHash }, { $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 } });
          }
        }
      } finally {
        // Same minimum response time for absent, throttled and existing accounts;
        // SMTP has a shorter fixed deadline. Database outages may exceed this time.
        await wait(Math.max(0, responseDelay - (Date.now() - started)));
      }
      res.set('Cache-Control', 'no-store');
      res.json({ success: true, message: 'Si existe una cuenta con ese correo y se puede enviar el mensaje, recibirás un enlace. Revisa también spam. Si ya lo has pedido, espera unos minutos.' });
    },
    resetPassword: async (req, res) => {
      const { token, password } = req.body || {};
      if (!validRecoveryToken(token)) throw invalidLink();
      validateNewPassword(password);
      if (!(await allow('reset', token, 10))) throw new AppError('Demasiados intentos. Espera unos minutos y vuelve a intentarlo.', 429);
      const filter = { passwordResetTokenHash: hashRecoveryToken(token), passwordResetExpiresAt: { $gt: new Date() }, isDemo: { $ne: true } };
      if (!(await users.exists(filter))) throw invalidLink();
      const hashed = await bcrypt.hash(password, 12);
      // Atomic compare-and-update consumes the token once, even with concurrent requests.
      // Query updates do not run the User pre-save hook: password is already hashed.
      const user = await users.findOneAndUpdate({ ...filter, passwordResetExpiresAt: { $gt: new Date() } }, {
        $set: { password: hashed }, $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 }, $inc: { sessionVersion: 1 },
      }, { new: true });
      if (!user) throw invalidLink();
      res.set('Cache-Control', 'no-store');
      res.json({ success: true, message: 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.' });
    },
  };
}
export const { forgotPassword, resetPassword } = createRecoveryHandlers();
