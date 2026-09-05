import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';

const events = [
  ['The Next Inch: Leadership', '2027-02-18T18:00:00.000Z', 'Madrid · Espacio KelseTS', 'Liderazgo', '/images/events/event-leadership.webp', 'Laura Vega convierte la presión del último cuarto en una conversación práctica sobre decisiones, responsabilidad y liderazgo compartido. Saldrás con una jugada concreta para activar con tu equipo.', 180],
  ['The Comeback Mindset', '2027-03-11T18:30:00.000Z', 'Barcelona · Impact Hub', 'Resiliencia', '/images/events/event-comeback.webp', 'Daniel Roca explora cómo volver después de un tropiezo sin ignorar lo aprendido. Una experiencia sobre recuperación, constancia y el valor de avanzar paso a paso.', 140],
  ['One Team, One Play', '2027-04-08T17:30:00.000Z', 'Valencia · La Marina', 'Equipo', '/images/events/event-teamwork.webp', 'Marcus Reed propone dinámicas para transformar un grupo de talento individual en un equipo que comparte contexto, confianza y una dirección clara.', 200],
  ['Perform Under Pressure', '2027-05-20T18:00:00.000Z', 'Bilbao · BAT Tower', 'Rendimiento', '/images/events/event-pressure.webp', 'Una sesión para reconocer el ruido, recuperar el foco y actuar cuando el margen es pequeño. Herramientas del entrenamiento deportivo aplicadas al trabajo diario.', 120],
  ['The Last Quarter', '2027-06-17T18:30:00.000Z', 'Sevilla · Cartuja Center', 'Rendimiento', '/images/events/event-last-quarter.webp', 'Cuando el tiempo aprieta, cada decisión importa. Esta experiencia trabaja prioridades, comunicación y energía colectiva para cerrar proyectos exigentes.', 240],
  ['Trust Is the Strategy', '2027-09-16T18:00:00.000Z', 'Málaga · Muelle Uno', 'Equipo', '/images/events/event-trust.webp', 'La confianza no es una consigna: se entrena en cada interacción. Un talk sobre seguridad, conversaciones difíciles y coordinación real.', 160],
  ['Innovate the Playbook', '2027-10-21T17:30:00.000Z', 'Madrid · KelseTS Business School', 'Innovación', '/images/events/event-innovation.webp', 'Amina Nasser conecta estrategia deportiva e innovación para ayudar a los equipos a cuestionar su plan sin perder su propósito.', 150],
  ['Resilience Is a Team Sport', '2027-11-18T18:30:00.000Z', 'A Coruña · Palexco', 'Resiliencia', '/images/events/event-resilience.webp', 'Una experiencia que desmonta el mito de la resiliencia solitaria y muestra cómo pedir ayuda, repartir el esfuerzo y volver al terreno de juego.', 190],
];

const seed = async () => {
  if (!process.env.SEED_PASSWORD || process.env.SEED_PASSWORD.length < 8) throw new Error('Define SEED_PASSWORD con un mínimo de 8 caracteres.');
  await connectDatabase();
  let organizer = await User.findOne({ email: 'talks@kelsets.com' });
  if (!organizer) organizer = await User.create({ name: 'KelseTS Talks', email: 'talks@kelsets.com', password: process.env.SEED_PASSWORD, role: 'admin' });

  for (const [title, date, location, category, poster, description, capacity] of events) {
    await Event.updateOne({ title }, { $set: { date, location, category, poster, description, capacity, creator: organizer._id } }, { upsert: true });
  }

  console.log(`${events.length} experiencias KelseTS preparadas.`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(`No se pudieron preparar los datos: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});
