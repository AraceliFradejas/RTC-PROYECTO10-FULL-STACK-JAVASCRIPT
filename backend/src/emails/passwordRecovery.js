const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function recoveryUrl(appUrl, token, language = 'es') {
  const url = new URL('/reset-password', appUrl);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('Invalid public application URL');
  url.hash = new URLSearchParams({ token, language: language === 'en' ? 'en' : 'es' }).toString();
  return url.href;
}
export function passwordRecoveryEmail({ token, language = 'es', appUrl }) {
  const en = language === 'en';
  const url = recoveryUrl(appUrl, token, language);
  const subject = en ? 'Reset your password · KelseTS Talks' : 'Recupera tu contraseña · KelseTS Talks';
  const intro = en ? 'We received a request to reset your KelseTS Talks password.' : 'Hemos recibido una solicitud para restablecer tu contraseña de KelseTS Talks.';
  const action = en ? 'Set a new password' : 'Elegir una nueva contraseña';
  const expiry = en ? 'This link expires in 30 minutes and can only be used once.' : 'Este enlace caduca en 30 minutos y solo puede utilizarse una vez.';
  const ignore = en ? 'If you did not request this change, ignore this email. Your password has not changed.' : 'Si no has solicitado este cambio, ignora este correo. Tu contraseña no ha cambiado.';
  return { subject, text: `${intro}\n\n${action}: ${url}\n\n${expiry}\n${ignore}`,
    html: `<!doctype html><html lang="${en ? 'en' : 'es'}"><body style="font-family:Arial,sans-serif;color:#1a1a1a;background:#f8f8fa;padding:24px"><main style="max-width:560px;margin:auto;background:#fff;padding:28px;border-radius:16px"><p>KelseTS Talks</p><h1 style="font-size:26px">${escape(subject)}</h1><p>${intro}</p><p style="margin:28px 0"><a href="${escape(url)}" style="display:inline-block;background:#b91c2b;color:#fff;padding:15px 20px;border-radius:8px">${action}</a></p><p>${expiry}</p><p>${ignore}</p><p style="overflow-wrap:anywhere;font-size:14px">${escape(url)}</p></main></body></html>` };
}
