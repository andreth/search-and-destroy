'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add xp column to users (total accumulated XP)
    await queryInterface.addColumn('users', 'xp', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Add xpRequired column to levels (total XP needed to reach this level)
    await queryInterface.addColumn('levels', '"xpRequired"', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Seed xpRequired for 15 levels (progressive curve)
    const xpTable = [
      { level: 1,  xp: 0 },
      { level: 2,  xp: 500 },
      { level: 3,  xp: 1200 },
      { level: 4,  xp: 2100 },
      { level: 5,  xp: 3200 },
      { level: 6,  xp: 4600 },
      { level: 7,  xp: 6300 },
      { level: 8,  xp: 8400 },
      { level: 9,  xp: 10800 },
      { level: 10, xp: 13600 },
      { level: 11, xp: 16800 },
      { level: 12, xp: 20500 },
      { level: 13, xp: 24800 },
      { level: 14, xp: 29800 },
      { level: 15, xp: 35500 }
    ];

    for (const row of xpTable) {
      await queryInterface.sequelize.query(
        `UPDATE levels SET "xpRequired" = ${row.xp} WHERE "levelNumber" = ${row.level}`
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'xp');
    await queryInterface.removeColumn('levels', '"xpRequired"');
  }
};
