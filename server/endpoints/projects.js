const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll();
        return res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
