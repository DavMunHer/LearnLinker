const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where, Op } = require('sequelize');
const Project = require('../models/Project');
const dotenv = require('dotenv').config();

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.get('/user/:user_email', async (req, res) => {
    try {
        const user = await User.findOne({ where: { 'email': req.params.user_email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

router.post('/user/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({ message: 'The email is already used!' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registration successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const existingUser = await User.findOne({ where: { [Op.or]: { username: usernameOrEmail, email: usernameOrEmail } } });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const passwordValidation = await bcrypt.compare(password, existingUser.password);

        if (!passwordValidation) {
            return res.status(401).json({ message: 'The credentials are invalid.' });
        }

        const secretKey = process.env.JWT_SECRET_KEY;

        const token = jwt.sign({
            username: existingUser.username,
            email: existingUser.email
        }, secretKey, { expiresIn: '30d' });
        res.json( token );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/user/:user_email/projects', async (req, res) => {
    try {
        const userEmail = (req.params.user_email);
        console.log(userEmail);
        const userProjectsInfo = await User.findAll({
            where: { email: userEmail },
            attributes: [],
            include: [{
              model: Project,
              through: {
                attributes: ['role']
              }
            }]
        });
        /*
        Una vez obtenemos el array con el objeto del usuario incluyendo los proyectos, de aquí cogemos únicamente
        el array de proyectos
        */
        if (userProjectsInfo.length == 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const userProjects = userProjectsInfo[0].Projects;
        res.json(userProjects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }

});



// ... Otros endpoints

module.exports = router;
