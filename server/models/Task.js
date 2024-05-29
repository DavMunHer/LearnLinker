const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Phase = require('./Phase');
const User = require('./User');
const TaskUser = require('./task_user');
const Have = require('./Have');

const Task = sequelize.define('Task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phaseId: {
        type: Sequelize.INTEGER,
        references: {
            model: Phase,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    start_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deadline: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    end_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
},
    {
        tableName: 'tasks',
        timestamps: true
    }
);

// Asociaciones con otros modelos
Task.belongsTo(Phase);
// Task.belongsTo(User, {through: Have});
// Task.belongsToMany(User, { through: 'task_user' });

module.exports = Task;
