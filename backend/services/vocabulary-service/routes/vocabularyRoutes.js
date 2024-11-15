const express = require('express');
const Vocabulary = require('../models/Vocabulary');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.use(authenticateToken);

router.get('/:lesson', async (req, res) => {
  const lesson = req.params.lesson;
  const userId = req.user.userId;
  try {
    const words = await Vocabulary.find({ lesson, userId });
    res.json(words);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { word, type, vietnamesedefinition, example, lesson } = req.body;
  const userId = req.user.userId;
  try {
    const existingWord = await Vocabulary.findOne({ word, type, lesson, userId });
    if (existingWord) {
      return res.status(400).json({ message: 'Word already exists in this lesson for this user' });
    }

    const newWord = new Vocabulary({ word, type, vietnamesedefinition, example, lesson, userId });
    await newWord.save();
    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/lessons/list', async (req, res) => {
  const userId = req.user.userId;
  try {
    const lessons = await Vocabulary.find({ userId }).distinct('lesson');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:lesson/:word', async (req, res) => {
  const lesson = req.params.lesson;
  const word = req.params.word;
  const userId = req.user.userId;
  
  try {
    const deletedWord = await Vocabulary.findOneAndDelete({ lesson, word, userId });
    if (!deletedWord) {
      return res.status(404).json({ message: 'Word not found in this lesson for this user' });
    }
    res.json({ message: 'Word deleted successfully', deletedWord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;