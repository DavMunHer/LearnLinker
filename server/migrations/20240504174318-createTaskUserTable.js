'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('task_user',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'User',
                        key: 'id'
                    },
                    onDelete: 'CASCADE'
                },
                task_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Task',
                        key: 'id'
                    },
                    onDelete: 'CASCADE'
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
