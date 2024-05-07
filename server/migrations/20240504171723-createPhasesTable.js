'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('phases',
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                start_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                deadline: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                end_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                projectId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'projects',
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
        await queryInterface.dropTable('phases');
    }
};
