const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const Task = require('../models/Task');

router.post('/create/task', async (req, res) => {
    try {
        const { name, start_date, deadline, phaseId } = req.body;
        await Task.create({ name, start_date, deadline, phaseId });
        res.status(201).json({ message: 'Task creation successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

module.exports = router;
