'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('project_user',
            {
                user_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'User',
                        key: 'id'
                    },
                    primaryKey: true,
                    onDelete: 'CASCADE'
                },
                project_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Project',
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
