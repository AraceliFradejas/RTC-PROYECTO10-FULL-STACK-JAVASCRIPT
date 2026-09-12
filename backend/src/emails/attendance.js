const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const copy = {
  es: {
    confirmed: 'Tu plaza está confirmada', cancelled: 'Tu reserva se ha cancelado',
    greeting: 'Hola', intro: 'Ya formas parte de esta experiencia. Estos son los detalles de tu próxima charla:',
    cancelledIntro: 'Hemos cancelado tu asistencia a esta charla. Si cambias de planes, puedes volver a reservar mientras haya plazas.',
    date: 'Cuándo', location: 'Dónde', manage: 'Gestionar o cancelar mi reserva', view: 'Ver la charla',
    help: 'Para cancelar, abre tu reserva, inicia sesión con este mismo correo y pulsa «Plaza confirmada». Abrir este enlace no cancela tu asistencia.',
    footer: 'KelseTS Talks es una plataforma ficticia de un proyecto de máster, sin fines lucrativos y con finalidad pedagógica.',
  },
  en: {
    confirmed: 'Your place is confirmed', cancelled: 'Your booking has been cancelled',
    greeting: 'Hi', intro: 'You’re part of the experience. Here are the details of your upcoming talk:',
    cancelledIntro: 'Your attendance at this talk has been cancelled. If your plans change, you can book again while places remain.',
    date: 'When', location: 'Where', manage: 'Manage or cancel my booking', view: 'View the talk',
    help: 'To cancel, open your booking, sign in with this email address and click “Place confirmed”. Opening this link does not cancel your attendance.',
    footer: 'KelseTS Talks is a fictional platform for a nonprofit master’s project, created exclusively for educational purposes.',
  },
};

export const attendanceEmail = ({ event, user, language = 'es', cancelled = false, appUrl }) => {
  const lang = language === 'en' ? 'en' : 'es';
  const t = copy[lang];
  const base = new URL(appUrl);
  if (!['https:', 'http:'].includes(base.protocol)) throw new Error('Invalid public app URL');
  const url = new URL(`/events/${encodeURIComponent(event.id || event._id)}`, base).href;
  const title = event.translations?.[lang]?.title || event.title;
  const heading = cancelled ? t.cancelled : t.confirmed;
  const intro = cancelled ? t.cancelledIntro : t.intro;
  const button = cancelled ? t.view : t.manage;
  const date = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', {
    dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Madrid',
  }).format(new Date(event.date)) + ' (Europe/Madrid)';
  let poster = '';
  if (event.poster) {
    const image = new URL(event.poster, base);
    if (['http:', 'https:'].includes(image.protocol)) poster = image.href;
  }
  return {
    subject: `${heading} · ${title}`,
    text: `${t.greeting} ${user.name},\n\n${heading}\n${intro}\n\n${title}\n${t.date}: ${date}\n${t.location}: ${event.location}\n\n${button}: ${url}\n${cancelled ? '' : t.help}\n\n${t.footer}`,
    html: `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(heading)}</title>
<style>@media only screen and (max-width:600px){.email-pad{padding:24px!important}.email-column{display:block!important;width:100%!important;box-sizing:border-box!important}.email-details{padding:24px 0 0!important}.email-heading{font-size:32px!important}.email-logo{width:44px!important;height:44px!important}}</style></head>
<body style="margin:0;background:#f9fafb;color:#1a1a1a;font-family:'Outfit','Poppins',Arial,Helvetica,sans-serif">
<div style="display:none;max-height:0;overflow:hidden">${escape(heading)} · ${escape(title)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#ffffff;border:1px solid #e5e7eb">
<tr><td class="email-pad" style="padding:20px 32px;border-bottom:1px solid #e5e7eb"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
<td><a href="${escape(base.origin)}" style="color:#1a1a1a;text-decoration:none"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td><img class="email-logo" src="${escape(new URL('/images/brand/kelcets-logo.png', base).href)}" width="56" height="56" alt="" style="display:block;border-radius:8px"></td><td style="padding-left:10px;font-size:24px;font-weight:800;letter-spacing:-1px">KelceTS<span style="display:block;color:#c9252c;font-size:12px;letter-spacing:3px">TALKS</span></td></tr></table></a></td>
<td align="right" style="padding-left:12px;font-size:13px;font-weight:600"><a href="${escape(new URL('/', base).href)}" style="color:#c9252c;text-decoration:none">${lang === 'en' ? 'Visit KelseTS Talks' : 'Visitar KelseTS Talks'} &rarr;</a></td>
</tr></table></td></tr>
<tr><td class="email-pad" bgcolor="#c9252c" style="padding:36px 32px;background:#c9252c;background-image:linear-gradient(135deg,#ad1824 0%,#d82d30 62%,#a65712 100%);color:#ffffff">
<p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:2px;color:#ffe4b2">MOVE THE NEXT INCH.</p>
<h1 class="email-heading" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:40px;font-weight:800;letter-spacing:-1.4px;line-height:1.12;margin:0 0 20px">${heading}</h1>
<p style="font-size:16px;line-height:1.65;margin:0">${t.greeting} ${escape(user.name)}. ${intro}</p></td></tr>
<tr><td class="email-pad" style="padding:32px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e9e5e8;border-radius:24px"><tr><td style="padding:16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
${poster ? `<td class="email-column" width="220" valign="top" style="width:220px"><img src="${escape(poster)}" alt="${escape(title)}" width="220" style="display:block;width:100%;max-width:280px;height:auto;border-radius:16px"></td>` : ''}
<td class="email-column email-details" valign="top" style="padding:8px 0 8px ${poster ? '24' : '0'}px">
<span style="display:inline-block;background:#fff0f1;color:#bc202c;padding:7px 12px;border-radius:30px;font-size:12px;font-weight:700">${lang === 'en' ? (cancelled ? 'BOOKING CANCELLED' : 'YOUR NEXT EXPERIENCE') : (cancelled ? 'RESERVA CANCELADA' : 'TU PRÓXIMA EXPERIENCIA')}</span>
<h2 style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:25px;line-height:1.2;letter-spacing:-.7px;margin:18px 0">${escape(title)}</h2>
<p style="font-size:14px;line-height:1.6;margin:0 0 14px;color:#5b5b5b"><strong style="color:#c9252c">${t.date}</strong><br>${escape(date)}</p>
<p style="font-size:14px;line-height:1.6;margin:0;color:#5b5b5b"><strong style="color:#c9252c">${t.location}</strong><br>${escape(event.location)}</p>
</td></tr></table></td></tr></table>
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 22px"><tr><td bgcolor="#c9252c" style="background:#c9252c;border-radius:12px"><a href="${escape(url)}" style="display:inline-block;padding:17px 22px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700">${button} &rarr;</a></td></tr></table>
${cancelled ? '' : `<p style="font-size:13px;line-height:1.65;color:#5b5b5b;margin:0 0 18px">${t.help}</p>`}
<p style="font-size:12px;line-height:1.6;word-break:break-all;margin:0"><a href="${escape(url)}" style="color:#c9252c">${escape(url)}</a></p></td></tr>
<tr><td class="email-pad" bgcolor="#1a1a1a" style="padding:28px 32px;background:#1a1a1a;color:#d3d3d3">
<p style="margin:0 0 12px;color:#f59e0b;font-weight:700;font-size:12px;letter-spacing:2px">KELSETS TALKS</p>
<p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#ffffff">Move the next inch. Change the whole game.</p>
<p style="margin:0;font-size:12px;line-height:1.65">${t.footer}</p></td></tr></table></td></tr></table></body></html>`,
  };
};
