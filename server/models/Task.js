const Sequelize = require('sequelize');
const connection = require('../config/database');
const { timestamp } = require('rxjs');
const Phase = require('./Phase');
const User = require('./User');

const Task = connection.define('task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phase_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Phase',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    start_date: {
        type: Sequelize.DATE,
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
Task.belongsToMany(User);

Task.sync(); // Sincronizar el modelo con la base de datos

module.exports = Task;
