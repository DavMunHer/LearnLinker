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
        const { name, start_date, deadline, phaseId, users } = req.body;
        const task = await Task.create({ name, start_date, deadline, phaseId });
        if (users) {
            for (const user of users) {
                const developer = await User.findOne({ where: { 'email': user.email } });
                sequelize.query(`INSERT INTO task_user (userId, taskId) VALUES (${developer.id}, ${task.id});`);
            }
        }
        res.status(201).json({ message: 'Task creation successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

module.exports = router;
