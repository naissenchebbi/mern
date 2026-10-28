const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MongoDB URI is missing from environment variables (.env)');
  }

  await mongoose.connect(uri, {
    autoIndex: true
  });

  console.log('MongoDB connection established successfully!');
}

module.exports = connectDB;