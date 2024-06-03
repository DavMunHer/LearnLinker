const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const sequelize = require('../config/database');
const User = require('../models/User');
const Task = require('../models/Task');

Phase.hasMany(Task);
Task.belongsToMany(User, { through: 'task_user' });

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

router.get('/phase/:id', async (req, res) => {
    try {
        const phase = await Phase.findOne({
            where: { id: req.params.id },
            attributes: [
                'id', 'name',
                formatDateAttribute('Phase.start_date', 'start_date'),
                formatDateAttribute('Phase.end_date', 'end_date'),
                formatDateAttribute('Phase.deadline', 'deadline')
            ],
            include: [{
                model: Task,
                attributes: [
                    'id', 'name', 'description',
                    formatDateAttribute('Tasks.start_date', 'start_date'),
                    formatDateAttribute('Tasks.end_date', 'end_date'),
                    formatDateAttribute('Tasks.deadline', 'deadline'),
                ],
                include: {
                    model: User,
                    attributes: ['username', 'email'],
                    through: {
                        attributes: []
                    }
                }
            }]

        });
        if (!phase) {
            return res.status(404).json({ message: 'Phase not found.' });
        }
        return res.json(phase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/project/:id/create/phase', async (req, res) => {
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

router.patch('/edit/phase/:id', async (req, res) => {
    try {
        const phase = await Phase.findOne({ where: { id: req.params.id } });
        if (!phase) {
            return res.status(404).json({ message: 'Phase not found.' });
        }

        const { name, start_date, deadline } = req.body;
        await phase.update({ name, start_date, deadline });

        return res.json(phase);
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
