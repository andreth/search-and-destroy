'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'level_number', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
    });
    await queryInterface.sequelize.query(
      "UPDATE users SET level_number = 1 WHERE role = 'player' AND level_number IS NULL"
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'level_number');
  }
};
