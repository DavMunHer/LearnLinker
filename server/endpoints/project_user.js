const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const { where } = require('sequelize');
const router = express.Router();

// Endpoint para sacar el rol de un usuario en un proyecto
router.get('/user/:user_email/project/:projectId', async (req, res) => {
    try {
        const userEmail = (req.params.user_email);
        const userProjectsInfo = await User.findOne({
            where: { email: userEmail },
            attributes: [],
            include: {
                model: Project,
                where: {id: req.params.projectId},
                attributes: ['name'],
                through: {
                    attributes: ['role']
                },
            }
        });

        if (!userProjectsInfo) {
            // El usuario siempre existirá dado que su email se saca de la sesión (por tanto se ha registrado)
            return res.status(404).json({ message: 'The user is not in that project!.' });
        }
        const roleObject = userProjectsInfo.Projects[0].project_user;
        const role = roleObject.dataValues.role;
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
