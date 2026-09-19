import mongoose from 'mongoose';
import { eventCategories, speakerIds } from '../utils/eventRules.js';

const translationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 20, maxlength: 1200 },
}, { _id: false });

const eventSchema = new mongoose.Schema(
  {
    seedKey: { type: String, unique: true, sparse: true, immutable: true },
    speakerId: { type: String, enum: speakerIds, set: value => value === '' ? undefined : value },
    translations: { es: translationSchema, en: translationSchema },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 1200 },
    category: {
      type: String,
      enum: eventCategories,
      default: 'Otros',
    },
    poster: { type: String, default: '' },
    posterPublicId: { type: String, default: '', select: false },
    capacity: { type: Number, min: 1, max: 10000, default: 50 },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    demoAttendance: { type: Boolean, default: false },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, optimisticConcurrency: true }
);

export const Event = mongoose.model('Event', eventSchema);
