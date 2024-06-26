'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tasks',
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
                phaseId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'phases',
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
                description: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                end_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};
