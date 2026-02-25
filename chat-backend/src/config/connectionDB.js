import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABASE, {
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // don't terminate the process here; handle errors upstream or retry
    // process.exit(1);
  } 
};

export default connectDB;