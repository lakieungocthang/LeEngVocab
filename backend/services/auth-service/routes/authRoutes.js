const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();

const axiosInstance = axios.create({
  timeout: 5000,
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

router.post('/register', async (req, res) => {
  const { username, password, name, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = new User({ username, password });
    await user.save();
    const token = generateToken(user._id);

    await axios.post(
      `http://localhost:5002/user-profile-service/api`,
      { userId: user._id, name, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = generateToken(user._id);
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
