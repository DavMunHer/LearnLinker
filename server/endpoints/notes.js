const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op, literal } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const Task = require('../models/Task');
const User = require('../models/User');
const Note = require('../models/Note');

router.post('/create/note', async (req, res) => {
    try {
        const { date, summary, userEmail, taskId } = req.body;
        const note = await Note.create({ date: date, summary: summary });
        const user = await User.findOne({ where: { email: userEmail } });
        sequelize.query(`INSERT INTO have (taskId, userId, noteId) VALUES (${taskId}, ${user.id}, ${note.id});`);
        res.status(201).json({ message: 'Note created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;
