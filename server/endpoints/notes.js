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
});


// Endopoint para comprobar si un usuario ha comentado en una tarea en el día actual
router.get('/check/task/:taskId/user/:userEmail', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const user = await User.findOne({ where: { email: req.params.userEmail } });
        const noteId = await sequelize.query(`SELECT noteId FROM have WHERE taskId = ${taskId} AND userId = ${user.id};`);
        if (!noteId) {
            // El usuario no habrá comentado nunca en la tarea
            return res.json({ commented: false });
        }
        const todayDate = new Date().toISOString().split('T')[0];
        const commented = await sequelize.query(`SELECT h.taskId
        FROM have h
        JOIN notes n ON h.noteId = n.id
        WHERE h.userId = ${user.id} AND h.taskId = ${taskId} AND DATE(n.date) = DATE('${todayDate}');
        `);
        if (commented[0][0] && commented[0][0].taskId) {
            return res.json({ commented: true });
        } else {
            return res.json({ commented: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post('/create/note', async (req, res) => {
    try {
        const { date, summary, userEmail, taskId } = req.body;
        const note = await Note.create({ date: date, summary: summary });
        const user = await User.findOne({ where: { email: userEmail } });
        sequelize.query(`INSERT INTO have (taskId, userId, noteId) VALUES (${taskId}, ${user.id}, ${note.id});`);
        res.json({ id: note.id, date: note.date, summary: note.summary, user: { username: user.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.delete('/delete/note/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findByPk(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        await note.destroy();
        res.json({ message: 'Note deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;
