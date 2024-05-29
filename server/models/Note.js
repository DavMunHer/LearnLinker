const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
});

module.exports = Note;
