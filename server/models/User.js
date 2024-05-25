const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');
const Project = require('./Project');
const TaskUser = require('./task_user');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

},
    {
        tableName: 'users',
        timestamps: true
    }
);

// Asociaciones con otros modelos
User.belongsToMany(Task, { through: TaskUser });
User.belongsToMany(Project, {through: 'project_user'});

// User.sync(); // Sincronizar el modelo con la base de datos

module.exports = User;
