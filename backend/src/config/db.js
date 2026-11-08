const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s if server is unreachable
      socketTimeoutMS: 45000           // Close inactive sockets after 45s to avoid zombie connections
    };

    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inkloom', options);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    process.exit(1);
  }
};

// Monitor connection loss and restoration events
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Notice] Disconnected from database. Mongoose is attempting reconnection.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB Notice] Successfully reconnected to MongoDB.');
});

module.exports = connectDB;
