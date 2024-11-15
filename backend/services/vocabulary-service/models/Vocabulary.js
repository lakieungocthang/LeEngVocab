const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true },
  type: { type: String, required: true },
  vietnamesedefinition: { type: String, required: true },
  example: { type: String },
  lesson: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

module.exports = Vocabulary;
