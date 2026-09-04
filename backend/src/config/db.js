import mongoose from 'mongoose';

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) throw new Error('La variable MONGODB_URI no está configurada.');
  await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection;
};

