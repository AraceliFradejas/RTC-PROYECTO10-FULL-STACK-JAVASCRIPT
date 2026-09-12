import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { attendanceEmail } from './attendance.js';

const event = JSON.parse(readFileSync(new URL('../data/events.json', import.meta.url), 'utf8'))[0];
const directory = resolve('.email-previews');
mkdirSync(directory, { recursive: true });
for (const language of ['es', 'en']) {
  for (const cancelled of [false, true]) {
    const message = attendanceEmail({ event: { ...event, id: 'preview-event-leadership' }, user: { name: 'Araceli' }, language, cancelled, appUrl: 'http://127.0.0.1:5173' });
    const file = resolve(directory, `${cancelled ? 'cancelled' : 'confirmed'}-${language}.html`);
    writeFileSync(file, message.html);
    console.log(file);
  }
}
console.log('Vistas de muestra: los enlaces no corresponden a una reserva real. No se han enviado correos.');
