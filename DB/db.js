const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.dbURL);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
