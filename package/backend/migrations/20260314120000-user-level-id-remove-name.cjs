'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hasLevelNumber = await queryInterface.sequelize
      .query(
        "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'level_number' LIMIT 1",
        { type: Sequelize.QueryTypes.SELECT }
      )
      .then((r) => Array.isArray(r) && r.length > 0);

    await queryInterface.addColumn('users', 'level_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'levels', key: 'id' }
    });

    if (hasLevelNumber) {
      await queryInterface.sequelize.query(`
        UPDATE users u
        SET level_id = (SELECT id FROM levels l WHERE l.level_number = u.level_number LIMIT 1)
        WHERE u.level_number IS NOT NULL
      `);
      await queryInterface.removeColumn('users', 'level_number');
    }

    const hasFirstName = await queryInterface.sequelize
      .query(
        "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'firstName' LIMIT 1",
        { type: Sequelize.QueryTypes.SELECT }
      )
      .then((r) => Array.isArray(r) && r.length > 0);
    const hasLastName = await queryInterface.sequelize
      .query(
        "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'lastName' LIMIT 1",
        { type: Sequelize.QueryTypes.SELECT }
      )
      .then((r) => Array.isArray(r) && r.length > 0);

    if (hasFirstName) await queryInterface.removeColumn('users', 'firstName');
    if (hasLastName) await queryInterface.removeColumn('users', 'lastName');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'firstName', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('users', 'lastName', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('users', 'level_number', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
    });
    await queryInterface.sequelize.query(`
      UPDATE users u
      SET level_number = (SELECT level_number FROM levels l WHERE l.id = u.level_id LIMIT 1)
      WHERE u.level_id IS NOT NULL
    `);
    await queryInterface.removeColumn('users', 'level_id');
  }
};
