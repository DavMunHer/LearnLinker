const Sequelize = require('sequelize');
const sequelize = require('../config/database');

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

Project.associate = function (models) {
    Project.hasMany(models.Phase);
    Project.belongsToMany(models.User, {through: 'project_user'});
}
// Asociaciones con otros modelos

Project.sync(); // Sincronizar el modelo con la base de datos

module.exports = Project;
