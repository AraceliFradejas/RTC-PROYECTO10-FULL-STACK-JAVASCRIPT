import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { uploadBuffer, deleteImage } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';

const assertId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError('El identificador del evento no es válido.', 400);
};

const editableFields = ['title', 'date', 'location', 'description', 'category', 'capacity'];
export const eventPayload = (body) => editableFields.reduce((result, field) => {
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

export const listEvents = async (req, res) => {
  const { category, search, sort = 'soonest' } = req.query;
  const query = {};
  if (category && category !== 'Todos') query.category = category;
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { location: { $regex: search, $options: 'i' } },
  ];
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
  let poster = '';
  let posterPublicId = '';
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, 'kelsets-talks/events');
    poster = uploaded.secure_url;
    posterPublicId = uploaded.public_id;
  }
  const event = await Event.create({ ...eventPayload(req.body), poster, posterPublicId, creator: req.user.id });
  await event.populate('creator', 'name avatar');
  res.status(201).json({ success: true, data: event });
};

export const updateEvent = async (req, res) => {
  const event = await getOwnedEvent(req.params.id, req.user);
  editableFields.forEach((key) => {
    if (req.body[key] !== undefined) event[key] = req.body[key];
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
  res.json({ success: true, data: updated, message: attends ? 'Tu asistencia se ha cancelado.' : '¡Tu plaza está confirmada!' });
};
