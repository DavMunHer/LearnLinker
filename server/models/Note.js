const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

const Note = sequelize.define('Note', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    summary: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
    {
        tableName: 'notes',
        timestamps: true
    }
);

// Asociaciones con otros modelos
Note.belongsTo(User);
Note.belongsTo(Task);

Note.sync(); // Sincronizar el modelo con la base de datos

module.exports = Note;
