'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('task_user',
            {
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
                completed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                }
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('task_user');
    }
};
