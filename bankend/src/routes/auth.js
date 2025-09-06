const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret_here'; // Use .env in real projects

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
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await argon2.hash(password);

    // Store user in DB
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Registered successfully',
      user: { email: user.email, username: user.username }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { email: user.email, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
