const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');
const Project = require('./Project');

const Phase = sequelize.define('Phase', {
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
    projectId: {
        type: Sequelize.INTEGER,
        references: {
            model: Project,
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

Phase.belongsTo(Project);
// Asociaciones con otros modelos
Phase.associate = function () {
    Phase.hasMany(Task);
}


Phase.sync(); // Sincronizar el modelo con la base de datos

module.exports = Phase;

