const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize } = require('sequelize');

Phase.belongsTo(Project);
Project.hasMany(Phase);



router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll();
        return res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/project/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        // Formateo de las fechas para mostrarlas correctamente en el formulario de editar
        let [day, month, year] = new Date(project.start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).split('/');

        const start_date = `${year}-${month}-${day}`;
        [day, month, year] = new Date(project.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).split('/');
        const end_date = `${year}-${month}-${day}`;

        const frontProject = {
            name: project.name,
            start_date: start_date,
            end_date: end_date
        }
        res.send(frontProject);
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
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Project.start_date'), '%Y-%m-%d'), 'start_date'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Project.end_date'), '%Y-%m-%d'), 'end_date']],
            include: [{
                model: Phase,
                attributes: [
                    'id',
                    'name',
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('Phases.deadline'), '%Y-%m-%d'), 'deadline'],
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('Phases.start_date'), '%Y-%m-%d'), 'start_date'],
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('Phases.end_date'), '%Y-%m-%d'), 'end_date'],
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
        console.log(newProject);
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
        console.log(projectObject);
        if (!projectObject) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        projectObject.destroy();
        res.status(201).json({ message: 'Project elimination successful.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
