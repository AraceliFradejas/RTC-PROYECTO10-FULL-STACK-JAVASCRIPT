import mongoose from 'mongoose';

// Shared across serverless instances. Keys contain hashes, never email addresses.
const schema = new mongoose.Schema({
  _id: String,
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { versionKey: false });
export const RecoveryLimit = mongoose.model('RecoveryLimit', schema);
