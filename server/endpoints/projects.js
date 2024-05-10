const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize } = require('sequelize');
const { formatDateAttribute } = require('./helper');

Phase.belongsTo(Project);
Project.hasMany(Phase);


router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll({attributes: ['id', 'name', formatDateAttribute('start_date'), formatDateAttribute('end_date')]});
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

router.get('/project-details/:id', async (req, res) => {
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
        const newProject = new Project(projectRequest);
        newProject.save();
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
