const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const Task = require('../models/Task');
const User = require('../models/User');

router.post('/create/task', async (req, res) => {
    try {
        const { name, start_date, deadline, phaseId, users, projectId } = req.body;
        const task = await Task.create({ name, start_date, deadline, phaseId });
        if (users) {
            for (const user of users) {
                const developer = await User.findOne({ where: { 'email': user.email } });
                sequelize.query(`INSERT INTO task_user (userId, taskId) VALUES (${developer.id}, ${task.id});`);
                const existingUserInProject = await User.findOne({
                    where: { 'email': user.email },
                    include: [{
                        model: Project,
                        where: { 'id': projectId },
                    }]
                });
                if (!existingUserInProject) {
                    sequelize.query(`INSERT INTO project_user (userId, projectId, role) VALUES (${developer.id}, ${projectId}, "developer");`);
                }
            }
        }
        res.json(task);
        // res.status(201).json({ message: 'Task creation successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.delete('/delete/task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        await Task.destroy({ where: { id: taskId } });
        res.status(204).json({ message: 'Task deletion successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;
