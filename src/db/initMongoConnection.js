import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const mongoURI = `mongodb+srv://${getEnvVar('MONGODB_USER')}:${getEnvVar(
      'MONGODB_PASSWORD',
    )}@${getEnvVar('MONGODB_URL')}/${getEnvVar(
      'MONGODB_DB',
    )}?retryWrites=true&w=majority`;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection established successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};
