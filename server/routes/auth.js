const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: true,     
  sameSite: 'none',   
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = new User({ name, email, password });
  await user.save();

  const token = generateToken(user._id, user.email);
  res.cookie('authToken', token, cookieOptions);

  res.status(201).json({
    message: 'Registration successful',
    user: { id: user._id, name: user.name, email: user.email },
    token, 
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id, user.email);
  res.cookie('authToken', token, cookieOptions);

  res.json({
    message: 'Login successful',
    user: { id: user._id, name: user.name, email: user.email },
  });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ authenticated: true, userId: req.userId });
});

router.post('/logout', (req, res) => {
  res.clearCookie('authToken', cookieOptions);
  res.json({ message: 'Logout successful' });
});

module.exports = router;