import nodemailer from 'nodemailer';
import { passwordRecoveryEmail, recoveryUrl } from '../emails/passwordRecovery.js';

export function recoveryMailConfigured(env = process.env) {
  if (env.MAIL_ENABLED !== 'true' || !['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'MAIL_FROM', 'PUBLIC_APP_URL'].every(key => env[key])) return false;
  try { recoveryUrl(env.PUBLIC_APP_URL, 'configuration-check'); return true; } catch { return false; }
}
export async function sendRecoveryEmail({ email, token, language }, { env = process.env, createTransport = nodemailer.createTransport } = {}) {
  const transport = createTransport({
    host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true', requireTLS: env.SMTP_SECURE !== 'true',
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }, connectionTimeout: 3000, greetingTimeout: 3000, socketTimeout: 4000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  let timer;
  try {
    const result = await Promise.race([
      transport.sendMail({ from: env.MAIL_FROM, to: email, ...passwordRecoveryEmail({ token, language, appUrl: env.PUBLIC_APP_URL }) }),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Mail timeout')), 5000); }),
    ]);
    return Boolean(result.accepted?.length);
  } catch { console.warn('No se pudo enviar el correo de recuperación.'); return false; }
  finally { clearTimeout(timer); transport.close(); }
}
