const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phase_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Phase',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    start_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    deadline: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    end_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
},
    {
        tableName: 'tasks',
        timestamps: true
    }
);

// Asociaciones con otros modelos
Task.associate = function (models) {
    Task.belongsTo(models.Phase);
    Task.belongsToMany(models.User);
}
Task.sync(); // Sincronizar el modelo con la base de datos

module.exports = Task;