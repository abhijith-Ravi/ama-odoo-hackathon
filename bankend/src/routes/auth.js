const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const requireAuth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Simple email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Register
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered.' });

    const hashedPassword = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
      select: { id: true, email: true, username: true, createdAt: true },
    });

    return res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login -> returns JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    const payload = { email: user.email, sub: String(user.id) };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// Me -> requires Authorization: Bearer <token>
router.get('/me', requireAuth, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try { 
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    // To find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal if email is not registered
      return res.json({ message: 'If that email is registered, you will receive a password reset link.' });
    }
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    // Send the reset token via email
    const resetLink = `https://your-frontend-url.com/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`
    });
    res.json({ message: 'If that email is registered, you will receive a password reset link.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process forgot password.' });
  }
});



router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;    
    const hashedPassword = await argon2.hash(newPassword);
    
     await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
});

router.post('/logout', (req, res) => {
  // For JWT, logout is handled on the client by deleting the token.
  res.json({ message: 'Logged out. Please remove the token on the client.' });
});


module.exports = router;

