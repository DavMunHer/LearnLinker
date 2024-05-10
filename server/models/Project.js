const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Phase = require('./Phase');
const User = require('./User');

const Project = sequelize.define('Project', {
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

Project.hasMany(Phase);
Project.associate = function (models) {
Project.belongsToMany(models.User, {through: 'project_user'});
}

Project.sync(); // Sincronizar el modelo con la base de datos

module.exports = Project;
