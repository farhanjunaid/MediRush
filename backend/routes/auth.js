const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('../config/passport');
const googleOAuthEnabled = passport.googleOAuthEnabled;

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.get('/oauth-status', (req, res) => {
  res.json({ googleOAuth: googleOAuthEnabled });
});

// ── Email Signup ──────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
      token: generateToken(user._id),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Email Login ───────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({
      token: generateToken(user._id),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Google OAuth (optional) ───────────────────────────
router.get('/google', (req, res, next) => {
  if (!googleOAuthEnabled) {
    return res.status(503).json({
      message: 'Google sign-in is not configured. Use email/password or add OAuth credentials to backend/.env',
    });
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!googleOAuthEnabled) {
    return res.redirect(`${process.env.CLIENT_URL}/auth?error=google_not_configured`);
  }
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`,
    session: false,
  })(req, res, next);
}, (req, res) => {
  const token = generateToken(req.user._id);
  const name = encodeURIComponent(req.user.name);
  const email = encodeURIComponent(req.user.email);
  res.redirect(
    `${process.env.CLIENT_URL}/auth?token=${token}&name=${name}&email=${email}`
  );
});

module.exports = router;