const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where, Op } = require('sequelize');
const Project = require('../models/Project');
const { formatDateAttribute } = require('./helper');
const dotenv = require('dotenv').config();

// Endpoint para conseguir todos los usuarios (no se debería usar en el front)
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Endpoint para verificar si un usuario existe o no mediante su email o nombre de usuario
router.get('/user/:user_email_or_username', async (req, res) => {
    try {
        const usernameOrEmail = req.params.user_email_or_username;
        const existingUser = await User.findOne({ where: { [Op.or]: { username: usernameOrEmail, email: usernameOrEmail } } });
        if (existingUser) {
            res.json({username: existingUser.username, email: existingUser.email });
        } else {
            return res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Endpoint para verificar si un usuario existe o no mediante su email o nombre de usuario y si está en un proyecto
router.get('/user/check/:user_email_or_username/project/:projectId', async (req, res) => {
    try {
        const usernameOrEmail = req.params.user_email_or_username;
        const existingUserInProject = await User.findOne({
            where: { [Op.or]: { username: usernameOrEmail, email: usernameOrEmail } },
            include: [{
                model: Project,
                where: { id: req.params.projectId },
                through: {
                    attributes: ['role']
                }
            }]
        });

        // Primeramente comprobamos si el usuario está en el proyecto y si es así, lo devolvemos con su rol
        if (existingUserInProject) {
            res.json({username: existingUserInProject.username, email: existingUserInProject.email, role: existingUserInProject.Projects[0].project_user.dataValues.role });
        } else {
            // Cuando el usuario no está en el proyecto vemos si se ha registrado en la plataforma y si es así lo devolvemos
            const existingUser = await User.findOne({ where: { [Op.or]: { username: usernameOrEmail, email: usernameOrEmail } } });
            if (existingUser) {
                res.json({username: existingUser.username, email: existingUser.email });
            } else {
                return res.status(404).json({ message: 'User not found.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Enpoint para recoger la información de un usuario con su email
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

// Endpoint para registrar al usuario
router.post('/user/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUserEmail = await User.findOne({ where: { email: email } });

        if (existingUserEmail) {
            return res.status(400).json({ message: 'The email is already used!' });
        }

        const existingUserUsername = await User.findOne({ where: { username: username } });

        if (existingUserUsername) {
            return res.status(400).json({ message: 'The username is already used!' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        newUser.save();
        res.status(201).json({ message: 'User registration successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Endpoint para verificar el login
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
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Endpoint para sacar los proyectos de un usuario
router.get('/user/:user_email/projects', async (req, res) => {
    try {
        const userEmail = (req.params.user_email);
        const userProjectsInfo = await User.findOne({
            where: { email: userEmail },
            attributes: [],
            include: [{
                model: Project,
                attributes: ['id', 'name', formatDateAttribute('start_date'), formatDateAttribute('end_date')],
                through: {
                    attributes: ['role']
                }
            }]
        });
        /*
        Una vez obtenemos el array con el objeto del usuario incluyendo los proyectos, de aquí cogemos únicamente
        el array de proyectos
        */
        if (!userProjectsInfo) {
            // En un principio esto nunca ocurrirá porque se saca el email de la sesión -> el usuario ya está registrado
            return res.status(404).json({ message: 'User not found.' });
        }
        const userProjects = userProjectsInfo.Projects;
        res.json(userProjects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});




module.exports = router;
