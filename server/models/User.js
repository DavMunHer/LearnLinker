const Sequelize = require('sequelize');
const connection = require('../config/database');
const { timestamp } = require('rxjs');

const User = connection.define('user', {
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
// User.hasMany(Post);

User.sync(); // Sincronizar el modelo con la base de datos

module.exports = User;
