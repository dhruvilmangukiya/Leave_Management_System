'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('userLeaveModels', { 
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
      totalLeave: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 12
      },
      availableLeave: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 12
      },
      usedLeave:{
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      academicYear: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: new Date().getFullYear()
      },
      totalWorkingDays: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 300
      },
      attendancePercentage: {
          type: Sequelize.DECIMAL,
          allowNull: false,
          defaultValue: 100
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
    await queryInterface.dropTable('userLeaveModels');
  }
};
