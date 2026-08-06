const mongoose = require('mongoose');
const env = require('./env');

// Disable query buffering so Mongoose fails immediately if offline instead of hanging for 10 seconds
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed (${error.message}). Server running in Instant Memory Fallback Mode.`);
    return null;
  }
};

module.exports = connectDB;
