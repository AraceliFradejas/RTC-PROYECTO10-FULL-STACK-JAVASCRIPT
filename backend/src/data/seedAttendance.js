import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { demoTarget, missingDemoIds } from './demoAttendance.js';

const catalogue = JSON.parse(readFileSync(new URL('./events.json', import.meta.url), 'utf8'));
const firstNames = ['Lucía', 'Mateo', 'Sofía', 'Hugo', 'Valeria', 'Daniel', 'Martina', 'Pablo', 'Nora', 'Álex', 'Elena', 'Bruno', 'Clara', 'Marcos', 'Irene', 'Leo', 'Carmen', 'Adrián', 'Sara', 'David'];
const surnames = ['Vega', 'Ríos', 'Soler', 'Luna', 'Sierra', 'Vidal', 'Robles', 'Campos', 'Marín', 'Fuentes'];

const seed = async () => {
  if (process.argv.includes('--dry-run')) {
    console.table(catalogue.map((e, i) => ({ charla: e.seedKey, aforo: e.capacity, objetivo: demoTarget(e, i), libres: e.capacity - demoTarget(e, i) })));
    return;
  }
  await connectDatabase();
  await User.init();
  const events = await Event.find({ seedKey: { $in: catalogue.map(e => e.seedKey) } });
  if (events.length !== catalogue.length) throw new Error('Carga primero el catálogo con npm run seed.');
  const poolSize = Math.max(...events.map(e => e.capacity));
  if (poolSize > 1000) throw new Error('Aforo de demostración demasiado alto. Revisa el catálogo.');
  // insertMany does not run pre-save hooks: hash an unrecorded random secret here.
  const password = await bcrypt.hash(randomBytes(32).toString('hex'), 12);
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (let i = 0; i < poolSize; i++) {
        const email = `attendee-${String(i + 1).padStart(3, '0')}@demo.kelsets.invalid`;
        const existing = await User.findOne({ email }).session(session);
        if (existing && !existing.isDemo) throw new Error('Conflicto con una cuenta no marcada como demostración.');
        if (!existing) await User.insertMany([{ email, password, isDemo: true, name: `${firstNames[i % firstNames.length]} ${surnames[Math.floor(i / firstNames.length) % surnames.length]}${i >= 200 ? ' López' : ''}` }], { session });
      }
      const users = await User.find({ isDemo: true, email: /@demo\.kelsets\.invalid$/ }).sort({ email: 1 }).session(session);
      for (const [index, entry] of catalogue.entries()) {
        const event = await Event.findOne({ seedKey: entry.seedKey }).session(session);
        const ids = missingDemoIds(event, users.map(u => u._id), demoTarget(event, index));
        const result = await Event.updateOne({ _id: event._id }, { $addToSet: { attendees: { $each: ids } }, $set: { demoAttendance: true } }, { session });
        if (!result.matchedCount) throw new Error('No se encontró la charla.');
        // Repair inverse demo references as well when a run is repeated.
        await User.updateMany({ _id: { $in: [...event.attendees, ...ids] }, isDemo: true }, { $addToSet: { attendingEvents: event._id } }, { session });
      }
    });
  } finally { await session.endSession(); }
  const result = await Event.find({ seedKey: { $in: catalogue.map(e => e.seedKey) } }).sort({ date: 1 });
  console.table(result.map(e => ({ charla: e.seedKey, confirmadas: e.attendees.length, libres: e.capacity - e.attendees.length })));
  console.log('Asistentes ficticios preparados. Sin envío de correos; reservas existentes conservadas.');
};
seed().catch(error => { console.error(`Carga no completada (${error.name}). Revisa la configuración y el catálogo.`); process.exitCode = 1; }).finally(() => mongoose.disconnect());
