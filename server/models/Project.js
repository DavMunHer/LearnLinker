const Sequelize = require('sequelize');
const connection = require('../config/database');
const { timestamp } = require('rxjs');
const User = require('./User');
const Phase = require('./Phase');

const Project = connection.define('project', {
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
    end_date: {
        type: Sequelize.DATE,
        allowNull: true
    }
},
    {
        tableName: 'projects',
        timestamps: true
    }
);

// Asociaciones con otros modelos
Project.belongsToMany(User);
Project.hasMany(Phase);

Project.sync(); // Sincronizar el modelo con la base de datos

module.exports = Project;
