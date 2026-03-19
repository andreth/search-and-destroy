'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('levels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      level_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    // Insérer les 15 niveaux par défaut
    const now = new Date();
    const levels = Array.from({ length: 15 }, (_, i) => ({
      level_number: i + 1,
      name: `Niveau ${i + 1}`,
      description: null,
      created_at: now,
      updated_at: now
    }));
    await queryInterface.bulkInsert('levels', levels);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('levels');
  }
};
