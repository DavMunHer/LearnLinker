const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const sequelize = require('../config/database');
const User = require('../models/User');
const Task = require('../models/Task');


router.get('/project/:id/phases', async (req, res) => {
    try {
        const phases = await Phase.findAll({
            where: { projectId: req.params.id },
            attributes: ['id', 'name',
                formatDateAttribute('start_date'),
                formatDateAttribute('end_date'),
                formatDateAttribute('deadline')]
        });
        return res.json(phases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


//FIXME: Cambiar el nombre de la ruta y poner un /create para que quede más claro
router.post('/project/:id/phase', async (req, res) => {
    try {
        const { name, start_date, deadline } = req.body;
        const projectId = req.params.id;
        const project = await Project.findOne({ where: { id: projectId } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const newPhase = await Phase.create({
            name,
            start_date,
            deadline,
            projectId: projectId
        });

        return res.json(newPhase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.delete('/phase/:id', async (req, res) => {
    try {
        const phase = await Phase.findOne({ where: { id: req.params.id } });
        if (!phase) {
            return res.status(404).json({ message: 'Phase not found.' });
        }

        await phase.destroy();
        return res.status(204).json({ message: 'Phase successfully deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
