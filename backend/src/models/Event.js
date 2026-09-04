import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 1200 },
    category: {
      type: String,
      enum: ['Arte', 'Música', 'Diseño', 'Tecnología', 'Gastronomía', 'Bienestar', 'Otros'],
      default: 'Otros',
    },
    poster: { type: String, default: '' },
    posterPublicId: { type: String, default: '', select: false },
    capacity: { type: Number, min: 1, max: 10000, default: 50 },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, versionKey: false }
);

export const Event = mongoose.model('Event', eventSchema);

