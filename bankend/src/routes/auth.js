const express = require('express');
const argon2 = require('argon2');
const { hash } = require('crypto');
const router = express.Router();

function isValidEmail(email) {
  // Simple regex for demonstration
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    const hashedPassword = await argon2.hash(password);
    // TODO: Save { email, username, hashedPassword } to your database

    res.status(201).json({
      message: 'Registered',
      user: { email, username }
      });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

async function getUserByEmail(email) {
  return {email:'', hashedPassword:'', username:''}; // TODO: Replace with actual DB call
}

router.post('/login', (req, res) => {
  router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const valid = await argon2.verify(user.hashedPassword, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { email: user.email, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
   res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router; 
});