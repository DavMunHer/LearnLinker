const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

router.post('/user/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(email);
        const existingUser = await User.findOne({where: { email: email }});
        console.log(`Usuario existente:`);
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ message: 'The email is already used!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        // TODO: Crear una jwt y enviarla al cliente para poder almacenarla en el navegador
        res.status(201).json({ message: 'User registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

// ... Otros endpoints

module.exports = router;
