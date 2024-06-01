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
const Have = require('../models/Have');

Note.belongsToMany(User, { through: Have });
Note.belongsToMany(Task, { through: Have });


router.get('/task/:taskId/notes', async (req, res) => {
    try {
        const { taskId } = req.params;
        const notes = await Note.findAll({
            attributes: ['id', formatDateAttribute('date'), 'summary'],
            include:
                [
                    {
                        through: { attributes: [] },
                        model: Task, where: { id: taskId }, attributes: ['id'],
                        include: [{ model: User, attributes: ['username'], through: { attributes: [] } }]
                    }
                ]
        });
        if (notes.length === 0) {
            return res.status(404).json({ message: 'Notes not found.' });
        }

        // Cambiamos el formato porque no nos interesa la información de la tarea asociada, solo el usuario
        let formattedNotes = [];
        for (const note of notes) {
            formattedNotes[notes.indexOf(note)] = {
                id: note.id,
                date: note.date,
                summary: note.summary,
                user: note.Tasks[0].Users[0]
            }
        }
        res.json(formattedNotes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})


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