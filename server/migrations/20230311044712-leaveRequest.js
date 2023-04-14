'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('leaveRequests', { 
      id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      requestToId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      leaveType	: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Full Day', 'First Half', 'Second Half']
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status	: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Pending', 'Approved', 'Rejected'],
        defaultValue: 'Pending'
      },
      createdAt:{
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt:{
          type: Sequelize.DATE,
          defaultValue: new Date()
      } 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('leaveRequests');
  }
};
