// server/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// ... Otros endpoints
