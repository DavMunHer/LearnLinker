const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Task = require('../models/Task');
const User = require('../models/User');

router.patch('/task/:id/user/:user_email', async (req, res) => {
    try {
        console.log(req.body);
        const { userCompleted } = req.body;
        const taskId = req.params.id;
        const user = await User.findOne({ where: { email: req.params.user_email } });
        if (!user) {
            //Esto en un principio no debería ocurrir nunca
            return res.status(404).json({ message: 'User not found.' });
        }
        const query = sequelize.query("UPDATE `task_user` SET `completed` = " + userCompleted +
            " WHERE `task_user`.`userId` = " + user.id + " AND `task_user`.`taskId` = " + taskId + ";");
        if (query) {
            return res.json({ message: 'Task completed status updated.' });
        } else {
            return res.status(500).json({ message: 'An error occurred' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
