const mongoose = require('mongoose');

let isConnected = false;
let mockDbMode = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_gravity_ats';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[Anti-Gravity DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Anti-Gravity DB] MongoDB Connection failed (${error.message}). Falling back to In-Memory Smart Store.`);
    isConnected = false;
    mockDbMode = true;
  }
};

module.exports = { connectDB, isConnected: () => isConnected, isMockMode: () => mockDbMode };
