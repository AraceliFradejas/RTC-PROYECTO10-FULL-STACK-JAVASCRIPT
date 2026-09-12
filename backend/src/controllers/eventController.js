import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { uploadBuffer, deleteImage } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';
import { sendAttendanceEmail } from '../services/attendanceMail.js';

const assertId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError('El identificador del evento no es válido.', 400);
};

const editableFields = ['title', 'date', 'location', 'description', 'category', 'capacity', 'speakerId'];
export const eventPayload = (body) => editableFields.reduce((result, field) => {
  if (field === 'speakerId' && body[field] !== undefined && !['', 'alison-patrick', 'jude-becks', 'anna-nasser', 'travis-wood'].includes(body[field])) {
    throw new AppError('Elige un ponente válido.', 400);
  }
  if (body[field] !== undefined) result[field] = body[field];
  return result;
}, {});

const getOwnedEvent = async (id, user) => {
  assertId(id);
  const event = await Event.findById(id).select('+posterPublicId');
  if (!event) throw new AppError('No hemos encontrado ese evento.', 404);
  if (event.creator.toString() !== user.id && user.role !== 'admin') throw new AppError('Solo la persona creadora puede modificar este evento.', 403);
  return event;
};

export const eventQuery = ({ category, search } = {}) => {
  const query = {};
  if (typeof category === 'string' && category && category !== 'Todos') query.category = category;
  if (typeof search === 'string' && search.trim()) {
    const accents = { a: '[aáàäâ]', e: '[eéèëê]', i: '[iíìïî]', o: '[oóòöô]', u: '[uúùüû]', n: '[nñ]' };
    const normalized = search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const literal = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = literal.replace(/[aeioun]/g, letter => accents[letter]);
    query.$or = ['title', 'description', 'location', 'category', 'translations.es.title', 'translations.es.description', 'translations.en.title', 'translations.en.description']
      .map(field => ({ [field]: { $regex: pattern, $options: 'i' } }));
  }
  return query;
};

export const listEvents = async (req, res) => {
  const { sort = 'soonest' } = req.query;
  const query = eventQuery(req.query);
  const sortOptions = { soonest: { date: 1 }, newest: { createdAt: -1 } };
  const events = await Event.find(query)
    .sort(sortOptions[sort] || sortOptions.soonest)
    .populate('creator', 'name avatar');
  if (sort === 'popular') events.sort((first, second) => second.attendees.length - first.attendees.length);
  res.json({ success: true, data: events, meta: { total: events.length } });
};

export const getEvent = async (req, res) => {
  assertId(req.params.id);
  const event = await Event.findById(req.params.id)
    .populate('creator', 'name avatar')
    .populate('attendees', 'name avatar');
  if (!event) throw new AppError('No hemos encontrado ese evento.', 404);
  res.json({ success: true, data: event });
};

export const createEvent = async (req, res) => {
  const payload = eventPayload(req.body);
  let poster = '';
  let posterPublicId = '';
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, 'kelsets-talks/events');
    poster = uploaded.secure_url;
    posterPublicId = uploaded.public_id;
  }
  const event = await Event.create({ ...payload, poster, posterPublicId, creator: req.user.id });
  await event.populate('creator', 'name avatar');
  res.status(201).json({ success: true, data: event });
};

export const updateEvent = async (req, res) => {
  const event = await getOwnedEvent(req.params.id, req.user);
  const payload = eventPayload(req.body);
  editableFields.forEach((key) => {
    if (payload[key] !== undefined) event[key] = payload[key];
  });
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, 'kelsets-talks/events');
    await deleteImage(event.posterPublicId);
    event.poster = uploaded.secure_url;
    event.posterPublicId = uploaded.public_id;
  }
  await event.save();
  res.json({ success: true, data: event });
};

export const deleteEvent = async (req, res) => {
  const event = await getOwnedEvent(req.params.id, req.user);
  await User.updateMany({ _id: { $in: event.attendees } }, { $pull: { attendingEvents: event.id } });
  await deleteImage(event.posterPublicId);
  await event.deleteOne();
  res.status(204).send();
};

export const toggleAttendance = async (req, res) => {
  assertId(req.params.id);
  const event = await Event.findById(req.params.id);
  if (!event) throw new AppError('No hemos encontrado ese evento.', 404);
  const attends = event.attendees.some((id) => id.equals(req.user._id));

  if (attends) {
    await Promise.all([
      Event.updateOne({ _id: event.id }, { $pull: { attendees: req.user.id } }),
      User.updateOne({ _id: req.user.id }, { $pull: { attendingEvents: event.id } }),
    ]);
  } else {
    const result = await Event.updateOne(
      { _id: event.id, attendees: { $ne: req.user._id }, $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] } },
      { $addToSet: { attendees: req.user.id } }
    );
    if (!result.modifiedCount) throw new AppError('El evento ya está completo.', 409);
    await User.updateOne({ _id: req.user.id }, { $addToSet: { attendingEvents: event.id } });
  }

  const updated = await Event.findById(event.id).populate('attendees', 'name avatar');
  const email = await sendAttendanceEmail({ event: updated, user: req.user, language: req.body?.language, cancelled: attends });
  res.json({ success: true, data: updated, email, message: attends ? 'Tu asistencia se ha cancelado.' : '¡Tu plaza está confirmada!' });
};
