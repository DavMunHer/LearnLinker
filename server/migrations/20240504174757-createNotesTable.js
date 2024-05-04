'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notes',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                task_user_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'task_user',
                        key: 'id',
                        raw: true
                    },
                    onDelete: 'CASCADE'
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                summary: {
                    type: Sequelize.STRING,
                    allowNull: false
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
        await queryInterface.dropTable('notes');
    }
};
