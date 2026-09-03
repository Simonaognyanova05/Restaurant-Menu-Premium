const mongoose = require('mongoose');

const connectDatabase = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
  console.log('MongoDB connected');
};

module.exports = connectDatabase;
