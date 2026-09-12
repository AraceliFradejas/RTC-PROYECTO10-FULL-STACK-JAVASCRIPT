import 'dotenv/config';
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';

const events = JSON.parse(readFileSync(new URL('./events.json', import.meta.url), 'utf8'));

const seed = async () => {
  // Validate the complete catalogue before writing anything to the database.
  for (const event of events) {
    await new Event({ ...event, creator: new mongoose.Types.ObjectId() }).validate();
  }
  if (process.argv.includes('--dry-run')) {
    console.log(`${events.length} charlas ES/EN válidas. No se ha conectado ni escrito en MongoDB.`);
    return;
  }
  await connectDatabase();
  let organizer = await User.findOne({ email: 'talks@kelsets.com' });
  if (!organizer) {
    if (!process.env.SEED_PASSWORD || process.env.SEED_PASSWORD.length < 8) {
      throw new Error('Define SEED_PASSWORD con un mínimo de 8 caracteres.');
    }
    organizer = await User.create({ name: 'KelseTS Talks', email: 'talks@kelsets.com', password: process.env.SEED_PASSWORD, role: 'admin' });
  }
  await Event.init();
  let created = 0;
  for (const { seedKey, ...data } of events) {
    // Stable identifiers prevent duplicates even when a title changes.
    // Existing reservations and organizer ownership are preserved.
    const result = await Event.updateOne(
      { seedKey },
      { $set: data, $setOnInsert: { seedKey, creator: organizer._id, attendees: [] } },
      { upsert: true, runValidators: true }
    );
    created += result.upsertedCount;
  }
  console.log(`${events.length} charlas ES/EN preparadas: ${created} nuevas, ${events.length - created} actualizadas.`);
};

seed().catch((error) => {
  // Do not print connection strings or credentials from driver errors.
  console.error(`No se pudieron preparar los datos (${error.name}). Revisa la configuración y la conexión.`);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
