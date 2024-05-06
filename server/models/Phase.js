const Sequelize = require('sequelize');
const connection = require('../config/database');
const { timestamp } = require('rxjs');
const Task = require('./Task');

const Phase = connection.define('phase', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    deadline: {
        type: Sequelize.DATE,
        allowNull: true
    },
    end_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    project_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Project',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
},
    {
        tableName: 'phases',
        timestamps: true
    }
);

// Asociaciones con otros modelos
Phase.hasMany(Task);
Phase.belongsTo(Project);

Phase.sync(); // Sincronizar el modelo con la base de datos

module.exports = Phase;
