const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// ... Otros endpoints

module.exports = router;
