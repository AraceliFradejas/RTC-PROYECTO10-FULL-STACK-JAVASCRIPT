import mongoose from 'mongoose';

let pendingConnection;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) throw new Error('La variable MONGODB_URI no está configurada.');
  if (!pendingConnection) {
    pendingConnection = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000, maxPoolSize: 10 })
      .then(() => mongoose.connection)
      .finally(() => { pendingConnection = undefined; });
  }
  return pendingConnection;
};
