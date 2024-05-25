const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Phase = require('../models/Phase');
const { Sequelize, Op } = require('sequelize');
const { formatDateAttribute } = require('./helper');
const sequelize = require('../config/database');
const Task = require('../models/Task');
const User = require('../models/User');
const TaskUser = require('../models/task_user');

Phase.belongsTo(Project);
Project.hasMany(Phase);
Project.belongsToMany(User, { through: 'project_user' });
Task.belongsTo(Phase);
Phase.hasMany(Task);
Task.belongsToMany(User, { through: 'task_user' });
// User.belongsToMany(Task, { through: 'task_user' });


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

// Ruta para dar los detalles de un proyecto para el home
router.get('/user/:user_email/project/:id/:role/details', async (req, res) => {
    try {
        const role = req.params.role;
        if (role == 'manager' || role == 'leader') {
            const project = await Project.findOne({
                where: { id: req.params.id },
                attributes: [],
                include: [{
                    model: Phase,
                    attributes: ['id', 'name', formatDateAttribute('Phases.start_date', 'start_date'), formatDateAttribute('Phases.end_date', 'end_date')],
                    include: {
                        model: Task,
                        attributes: [
                            'id', 'name', 'description',
                            formatDateAttribute('Phases->Tasks.deadline', 'deadline'),
                            formatDateAttribute('Phases->Tasks.start_date', 'start_date'),
                            formatDateAttribute('Phases->Tasks.end_date', 'end_date')
                        ]
                    }
                }]
            });
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            // Devolvemos las fases del proyecto junto a sus tareas dado que ya tenemos el proyecto
            return res.json(project.Phases);
        } else if (role == 'developer') {
            const user = await User.findOne({ where: { email: req.params.user_email } });
            const project = await Project.findOne({
                where: { id: req.params.id },
                attributes: [],
                include: [{
                  model: User,
                    where: { id: user.id },
                    attributes: ['email'],
                    include: [{
                      model: Task,
                      attributes: [
                        'id', 'name', 'description',
                        formatDateAttribute('Users->Tasks.deadline', 'deadline'),
                        formatDateAttribute('Users->Tasks.start_date', 'start_date'),
                          formatDateAttribute('Users->Tasks.end_date', 'end_date')
                        ],
                      through: { attributes: [] },
                      include: [{
                        model: Phase,
                          attributes: ['id', 'name',
                              formatDateAttribute('Users->Tasks->Phase.start_date', 'start_date'),
                              formatDateAttribute('Users->Tasks->Phase.end_date', 'end_date')],
                      }]
                    }]
                }]
              });
              // Esta consulta no funciona porque no se relaciona correctamente el modelo tarea con usuario
            // const project = await Project.findOne({
            //     where: { id: req.params.id },
            //     attributes: [],
            //     include: [{
            //       model: Phase,
            //       attributes: ['id', 'name', formatDateAttribute('Phases.start_date', 'start_date'), formatDateAttribute('Phases.end_date', 'end_date')],
            //       include: {
            //         model: Task,
            //         attributes: [
            //           'id', 'name', 'description',
            //           formatDateAttribute('Phases->Tasks.deadline', 'deadline'),
            //           formatDateAttribute('Phases->Tasks.start_date', 'start_date'),
            //           formatDateAttribute('Phases->Tasks.end_date', 'end_date')
            //         ],
            //         include: {
            //           model: User,
            //             where: { id: user.id },
            //             attributes: []
            //         },
            //         through: { attributes: [] }
            //       }
            //     }]
            // });
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const userTasksWithPhase = project.Users[0].Tasks;
            return res.json(userTasksWithPhase);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Obtener los datos de edición de proyectos dependiendo del rol
router.get('/project/:role/:action/details/:projectId', async (req, res) => {
    //FIXME: Revisar si el usuario tiene realmente acceso al proyecto
    try {
        const role = req.params.role;
        const action = req.params.action;
        const projectId = req.params.projectId;
        if (action == 'edit') {
            if (role == 'manager') {
                // Obtenemos el proyecto y sus líderes asociados
                const projectWithLeaders = await Project.findOne({
                    where: { id: projectId },
                    attributes: [
                        'name',
                        formatDateAttribute('Project.start_date', 'start_date'),
                        formatDateAttribute('Project.end_date', 'end_date')
                    ],
                    include: {
                        model: User,
                        attributes: [
                            'email',
                            'username',
                        ],
                        through: {
                            attributes: [],
                            where: {
                                role: 'leader'
                            }
                        }
                    }
                });

                if (!projectWithLeaders) {
                    return res.status(404).json({ message: 'Project not found.' });
                }
                res.json(projectWithLeaders);
            } else if (role == 'leader') {
                // Obtenemos el proyecto con sus fases
                const projectWithPhases = await Project.findOne({
                    where: { id: projectId },
                    attributes: [
                        'name',
                        formatDateAttribute('Project.start_date', 'start_date'),
                        formatDateAttribute('Project.end_date', 'end_date')
                    ],
                    include: {
                        model: Phase,
                        attributes: [
                            'id',
                            'name',
                            formatDateAttribute('Phases.deadline', 'deadline'),
                            formatDateAttribute('Phases.start_date', 'start_date'),
                            formatDateAttribute('Phases.end_date', 'end_date'),
                        ],
                        include: {
                            model: Task,
                            attributes: [
                                'id',
                                'name',
                                'phaseId',
                                formatDateAttribute('Phases->Tasks.start_date', 'start_date'),
                                formatDateAttribute('Phases->Tasks.end_date', 'end_date'),
                                formatDateAttribute('Phases->Tasks.deadline', 'deadline'),
                            ]
                        }
                    }
                });
                if (!projectWithPhases) {
                    return res.status(404).json({ message: 'Project not found.' });
                }
                res.json(projectWithPhases);
            } else if (role == 'developer') {
                res.status(403).json({ message: 'A developer cannot edit the project!' });
            } else {
                res.status(401).json({ message: 'Unexpected role!' });
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.put(`/update/project/:id`, async (req, res) => {
    try {
        const projectRequest = req.body;
        const projectId = req.params.id;

        const project = await Project.findByPk(projectId);
        if (!project) {
            return req.status(404).json({ message: 'Project not found.' });
        }

        const projectRequestData = {
            name: projectRequest.name,
            start_date: projectRequest.start_date,
            end_date: projectRequest.end_date
        }

        await project.update(projectRequestData);

        // Inicio lógica editar los líderes de proyecto
        if (projectRequest.Users) {
            // En este caso se podrán haber actualizado los usuarios frente a los que había previamente
            // Obtenemos los usuarios que habían previamente en el proyecto
            const projectWithLeaders = await Project.findOne({
                where: { id: projectId },
                attributes: [
                    'name',
                    formatDateAttribute('Project.start_date', 'start_date'),
                    formatDateAttribute('Project.end_date', 'end_date')
                ],
                include: {
                    model: User,
                    attributes: [
                        'id',
                        'email',
                    ],
                    through: {
                        attributes: [],
                        where: {
                            role: 'leader'
                        }
                    }
                }
            });
            const previousUsers = projectWithLeaders.Users;
            for (const leader of projectRequest.Users) {
                if (!previousUsers.find(previousLeader => previousLeader.email === leader.email)) {
                    // Cuando el líder no estaba presente previamente en la base de datos lo insertaremos
                    const leaderUser = await User.findOne({ where: { 'email': leader.email } });
                    sequelize.query(`INSERT INTO project_user (userId, projectId, role) VALUES (${leaderUser.id}, ${projectId}, "leader");`);
                }
            }

            for (const previousLeader of previousUsers) {
                if (!projectRequest.Users.find(leader => previousLeader.email === leader.email)) {
                    //Si el usuario se encontraba antes en la relación pero no en la request se eliminará
                    sequelize.query(`DELETE FROM project_user WHERE userId = ${previousLeader.id} AND projectId = ${projectId};`);
                }
            }
        }
        // Fin lógica editar los líderes de proyecto

        //TODO: Lógica para editar las fases poniendo las fases que este tendrá
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }

});

router.post('/create/project', async (req, res) => {
    try {
        const projectRequest = req.body;
        // if (projectRequest.user_email == projectRequest.leader_email) {
        //     // Código de respuesta 409 (conflicto)
        //     return res.status(409).json({ message: 'The manager cannot be the leader too!.' });
        // }

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

        for (const leaderObject of projectRequest.leaders) {
            const leaderUser = await User.findOne({ where: { 'email': leaderObject.email } });
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
        res.status(204).json({ message: 'Project successfully deleted.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
