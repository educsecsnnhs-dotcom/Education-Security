// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/caesar');
const { signToken } = require('../utils/auth');


const SALT = process.env.CAESAR_SALT || 'default-salt';


// Register (default role = User)
router.post('/register', async (req, res) => {
try {
const { username, password, meta } = req.body;
if (!username || !password) return res.status(400).json({ error: 'username & password required' });


const enc = encrypt(password, username, SALT);
const user = await User.create({ username, password: enc, roles: ['User'], meta });
res.json({ id: user._id, username: user.username, roles: user.roles });
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// Login (compare with decrypted stored password)
router.post('/login', async (req, res) => {
try {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });


const storedPlain = decrypt(user.password, username, SALT);
if (storedPlain !== password) return res.status(401).json({ error: 'Invalid credentials' });


const token = signToken(user);
res.json({ token, user: { id: user._id, username: user.username, roles: user.roles } });
} catch (err) {
res.status(500).json({ error: err.message });
}
});


module.exports = router;
