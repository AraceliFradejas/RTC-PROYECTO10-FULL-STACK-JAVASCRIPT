import test from 'node:test';
import assert from 'node:assert/strict';
import { attendanceEmail } from '../src/emails/attendance.js';
import { sendAttendanceEmail } from '../src/services/attendanceMail.js';

const details = {
  event: { id: 'abc123', title: 'Original', date: '2027-02-18T18:00:00Z', location: 'Madrid & equipo', poster: '/images/events/event-leadership.webp', translations: { es: { title: 'Liderazgo' }, en: { title: 'Leadership' } } },
  user: { name: '<img src=x onerror=alert(1)>', email: 'test@example.invalid' },
  appUrl: 'https://talks.example.com',
};
const env = { MAIL_ENABLED: 'true', MAIL_FROM: 'KelseTS <test@example.invalid>', PUBLIC_APP_URL: details.appUrl, SMTP_HOST: 'smtp.example.invalid', SMTP_USER: 'test', SMTP_PASSWORD: 'test' };

test('Correo ES/EN, fecha de Madrid, cartel completo y enlace a la ficha sin cancelar automáticamente', () => {
  const es = attendanceEmail(details);
  const en = attendanceEmail({ ...details, language: 'en' });
  assert.match(es.subject, /Tu plaza está confirmada · Liderazgo/);
  assert.match(en.subject, /Your place is confirmed · Leadership/);
  assert.match(es.text, /19:00/);
  assert.match(es.html, /https:\/\/talks.example.com\/images\/events\/event-leadership.webp/);
  assert.match(es.html, /height:auto/);
  assert.match(es.html, /href="https:\/\/talks.example.com\/events\/abc123"/);
  assert.doesNotMatch(es.html, /onerror=alert\(1\)>/);
  assert.match(es.html, /&lt;img/);
  assert.match(es.html, /Madrid &amp; equipo/);
  assert.match(en.text, /Opening this link does not cancel/);
  const cancelled = attendanceEmail({ ...details, cancelled: true });
  assert.match(cancelled.subject, /Tu reserva se ha cancelado/);
  assert.doesNotMatch(cancelled.html, /Gestionar o cancelar mi reserva/);
  assert.doesNotMatch(attendanceEmail({ ...details, event: { ...details.event, poster: 'javascript:alert(1)' } }).html, /src="javascript:/);
});

test('Envío desactivado o incompleto no intenta conectar', async () => {
  const createTransport = () => { throw Error('No debe conectar'); };
  assert.equal((await sendAttendanceEmail(details, { env: {}, createTransport })).status, 'disabled');
  assert.equal((await sendAttendanceEmail(details, { env: { MAIL_ENABLED: 'true' }, createTransport })).status, 'unconfigured');
});

test('Envío al correo del usuario autenticado, con HTML y texto; fallo SMTP controlado', async () => {
  let sent;
  const success = await sendAttendanceEmail(details, { env, createTransport: () => ({ sendMail: async message => { sent = message; return { accepted: [details.user.email] }; } }) });
  assert.equal(success.status, 'sent');
  assert.equal(sent.to.address, details.user.email);
  assert.ok(sent.html && sent.text);
  const failed = await sendAttendanceEmail(details, { env, createTransport: () => ({ sendMail: async () => { throw Error('SMTP failure'); } }) });
  assert.equal(failed.status, 'failed');
});

test('SMTP embeds local images as buffers and retains public Cloudinary artwork', async () => {
  let sent;
  const createTransport = () => ({ sendMail: async message => { sent = message; return { accepted: [details.user.email] }; } });
  await sendAttendanceEmail(details, { env: { ...env, PUBLIC_APP_URL: 'http://127.0.0.1:5173' }, createTransport });
  assert.equal(sent.attachments.length, 2);
  for (const attachment of sent.attachments) {
    assert.ok(Buffer.isBuffer(attachment.content) && attachment.content.length > 0);
    assert.ok(sent.html.includes(`src="cid:${attachment.cid}"`));
    assert.equal(attachment.path, undefined);
  }
  assert.doesNotMatch(sent.html, /src="http:\/\/127\.0\.0\.1/);
  const poster = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
  await sendAttendanceEmail({ ...details, event: { ...details.event, poster } }, { env, createTransport });
  assert.equal(sent.attachments.length, 1);
  assert.ok(sent.html.includes(poster));
  await sendAttendanceEmail({ ...details, event: { ...details.event, poster: '/../../.env' } }, { env, createTransport });
  assert.equal(sent.attachments.length, 1);
});
