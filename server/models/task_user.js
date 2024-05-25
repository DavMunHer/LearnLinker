const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');
const User = require('./User');

const TaskUser = sequelize.define('task_user', {
    taskId: {
        type: Sequelize.INTEGER,
        references: {
            model: Task,
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
}, {
    tableName: 'task_user',
    timestamps: true
});

module.exports = TaskUser;
