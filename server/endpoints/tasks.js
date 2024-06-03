const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op, literal } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const Task = require('../models/Task');
const User = require('../models/User');

Task.belongsToMany(User, { through: 'task_user' });


router.get('/task/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id },
            attributes: [
                'id',
                'name',
                'description',
                formatDateAttribute('start_date', 'start_date'),
                formatDateAttribute('deadline', 'deadline'),
            ],
            include: {
                model: User,
                attributes: ['username', 'email'],
                through: {
                    attributes: []
                }
            }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



// Endpoint para los detalles de una tarea (comprobando si el usuario tiene acceso a la tarea)
router.get('/task/:id/user/:user_email', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.user_email } });
        const userWithTaskDetails = await User.findOne({
            where: { id: user.id },
            attributes: ['email'],
            include: {
                model: Task,
                where: { id: req.params.id },
                attributes: [
                    'id',
                    'name',
                    'description',
                    'phaseId',
                    formatDateAttribute('Tasks.start_date', 'start_date'),
                    formatDateAttribute('Tasks.deadline', 'deadline'),
                    formatDateAttribute('Tasks.end_date', 'end_date'),
                    [literal("(SELECT COUNT(*) FROM task_user WHERE task_user.taskId = `Tasks`.`id`)"), 'totalUsersInTask'],
                    [literal("(SELECT COUNT(*) FROM task_user WHERE task_user.taskId = `Tasks`.`id` AND task_user.completed = 1)"), 'completedUsersInTask'],
                    [literal("(SELECT completed FROM task_user WHERE task_user.taskId = `Tasks`.`id` AND task_user.userId = " + user.id + ")"), 'userCompleted']
                ],
                through: {
                    attributes: []
                },
                include: [{
                    model: Phase,
                    attributes: ['name'],
                    include: [{
                        model: Project,
                        attributes: ['name']
                    }]
                }]
            }
        });
        if (!userWithTaskDetails) {
            return res.status(404).json({ message: 'Task not found for the actual user.' });
        }
        const taskDetails = userWithTaskDetails.Tasks[0];
        res.json(taskDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post('/create/task', async (req, res) => {
    try {
        const { name, description, start_date, deadline, phaseId, users, projectId } = req.body;
        const task = await Task.create({ name, description, start_date, deadline, phaseId });
        const formattedTask = await Task.findOne({
            where: { 'id': task.id },
            attributes: [
                'id',
                'name',
                'description',
                'phaseId',
                formatDateAttribute('start_date', 'start_date'),
                formatDateAttribute('deadline', 'deadline'),
                formatDateAttribute('end_date', 'end_date')
            ]
        });
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
        res.json(formattedTask);
        // res.status(201).json({ message: 'Task creation successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.put('/update/task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        const { name, description, start_date, deadline, phaseId, Users } = req.body;
        await task.update({ name, description, start_date, deadline, phaseId });
        if (Users) {
            await sequelize.query(`DELETE FROM task_user WHERE taskId = ${taskId}`);
            for (const user of Users) {
                const developer = await User.findOne({ where: { 'email': user.email } });
                sequelize.query(`INSERT INTO task_user (userId, taskId) VALUES (${developer.id}, ${taskId});`);
            }
        }
        res.status(204).json({ message: 'Task update successful.' });
    } catch (error) {
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
