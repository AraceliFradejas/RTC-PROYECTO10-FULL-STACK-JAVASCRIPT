import { emailImages } from '../emails/images.js';
import nodemailer from 'nodemailer';
import { attendanceEmail } from '../emails/attendance.js';

export const sendAttendanceEmail = async (details, { env = process.env, createTransport = nodemailer.createTransport } = {}) => {
  if (env.MAIL_ENABLED !== 'true') return { status: 'disabled' };
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.MAIL_FROM || !env.PUBLIC_APP_URL) {
    return { status: 'unconfigured' };
  }
  try {
    const transport = createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE === 'true',
      requireTLS: env.SMTP_SECURE !== 'true',
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
      connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10000,
      disableFileAccess: true, disableUrlAccess: true,
    });
    const { images, attachments } = await emailImages(details.event);
    const message = attendanceEmail({ ...details, appUrl: env.PUBLIC_APP_URL, images });
    const result = await transport.sendMail({ from: env.MAIL_FROM, to: { name: details.user.name, address: details.user.email }, ...message, attachments });
    return { status: result.accepted?.length ? 'sent' : 'failed' };
  } catch {
    // A mail failure must not undo a confirmed booking or expose SMTP credentials.
    console.warn('No se pudo enviar el correo de asistencia. La reserva conserva su estado.');
    return { status: 'failed' };
  }
};
