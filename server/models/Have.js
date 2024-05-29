const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Have = sequelize.define('Have', {
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    taskId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'tasks',
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    noteId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'notes',
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    }
},
{
    tableName: 'have',
    timestamps: true
});

module.exports = Have;
