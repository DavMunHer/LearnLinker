'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('project_user',
            {
                userId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    primaryKey: true,
                    onDelete: 'CASCADE'
                },
                projectId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'projects',
                        key: 'id'
                    },
                    primaryKey: true,
                    onDelete: 'CASCADE'
                },
                role: {
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
        await queryInterface.dropTable('project_user');
    }
};
