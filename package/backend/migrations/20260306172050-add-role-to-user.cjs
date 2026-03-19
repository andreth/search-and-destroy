'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'player'),
      defaultValue: 'player'
    });

    // Set existing admin user to 'admin' role
    await queryInterface.sequelize.query(
      "UPDATE users SET role = 'admin' WHERE username = 'admin'"
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
    // Note: ENUM types are not automatically removed in some dialects, but Sequelize handles it usually.
  }
};
