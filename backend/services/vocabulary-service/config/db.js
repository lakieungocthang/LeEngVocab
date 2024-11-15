// vocabulary-service/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for Vocabulary Service');
  } catch (err) {
    console.error('Error connecting MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
