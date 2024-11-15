const express = require('express');
const Profile = require('../models/Profile');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.use(authenticateToken);

router.get('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { userId, name, email } = req.body;
  try {
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }
    const newProfile = new Profile({ userId, name, email });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
