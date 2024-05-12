const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const sequelize = require('../config/database');
const User = require('../models/User');

Phase.belongsTo(Project);
Project.hasMany(Phase);


router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll({ attributes: ['id', 'name', formatDateAttribute('start_date'), formatDateAttribute('end_date')] });
        return res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/project/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ where: { id: req.params.id }, attributes: ['name', formatDateAttribute('start_date'), formatDateAttribute('end_date')] });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.send(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/project-:role-:action-details/:id', async (req, res) => {
    try {
        const projectWithPhases = await Project.findAll({
            where: { id: req.params.id },
            attributes: [
                'id',
                'name',
                formatDateAttribute('Project.start_date', 'start_date'),
                formatDateAttribute('Project.end_date', 'end_date')],
            include: [{
                model: Phase,
                attributes: [
                    'id',
                    'name',
                    formatDateAttribute('Phases.deadline', 'deadline'),
                    formatDateAttribute('Phases.start_date', 'start_date'),
                    formatDateAttribute('Phases.end_date', 'end_date'),
                ]
            }]
        });
        if (projectWithPhases.length == 0) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.send(projectWithPhases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/create/project', async (req, res) => {
    try {
        const projectRequest = req.body;
        if (projectRequest.user_email == projectRequest.leader_email) {
            // Código de respuesta 409 (conflicto)
            return res.status(409).json({ message: 'The manager cannot be the leader too!.' });
        }

        console.log(projectRequest.name);
        const loguedUser = await User.findOne({ where: { 'email': projectRequest.user_email } });

        let newProject = await Project.create({
            'name': projectRequest.name,
            'start_date': projectRequest.start_date,
            'end_date': projectRequest.end_date
        });
        const actual_date = new Date();
        const start_date = new Date(projectRequest.start_date);
        const end_date = new Date(projectRequest.end_date);

        if (start_date.getTime() < actual_date.getTime()) {
            return res.status(400).json({ message: 'The start date cannot be before the current date!' });
        }

        if (end_date.getTime() < start_date.getTime()) {
            return res.status(400).json({ message: 'The end date cannot be before the start date!' });
        }

        console.log(newProject);
        sequelize.query(`INSERT INTO project_user (userId, projectId, role) VALUES (${loguedUser.id}, ${newProject.id}, "manager");`);

        if (projectRequest.leaders.length == 0) {
            return res.status(400).json({ message: 'There must be a leader for the project!' });
        }

        for (const leaderEmailOrUsername of projectRequest.leaders) {
            const leaderUser = await User.findOne({ where: { [Op.or]: { 'email': leaderEmailOrUsername, 'username': leaderEmailOrUsername } } });
            // Esta comprobación no debería ser necesaria dado que los emails ya se han validado en el front previamente
            if (!leaderUser) {
                return res.status(404).json({ message: 'Leader not found.' });
            }
            sequelize.query(`INSERT INTO project_user (userId, projectId, role) VALUES (${leaderUser.id}, ${newProject.id}, "leader");`);
        }

        res.status(201).json({ message: 'Project creation successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.delete('/delete/project/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const projectObject = await Project.findByPk(id);
        if (!projectObject) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        projectObject.destroy();
        res.status(201).json({ message: 'Project successfully deleted.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
