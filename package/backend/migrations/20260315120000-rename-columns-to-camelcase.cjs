'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const q = queryInterface.sequelize.query.bind(queryInterface.sequelize);

    // levels: level_number → levelNumber, created_at → createdAt, updated_at → updatedAt
    const levelCols = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'levels'",
      { type: Sequelize.QueryTypes.SELECT }
    ).then((rows) => (rows || []).map((r) => r.column_name));

    if (levelCols.includes('level_number')) {
      await q('ALTER TABLE levels RENAME COLUMN level_number TO "levelNumber"');
    }
    if (levelCols.includes('created_at')) {
      await q('ALTER TABLE levels RENAME COLUMN created_at TO "createdAt"');
    }
    if (levelCols.includes('updated_at')) {
      await q('ALTER TABLE levels RENAME COLUMN updated_at TO "updatedAt"');
    }

    // users: level_id → levelId
    const userCols = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'",
      { type: Sequelize.QueryTypes.SELECT }
    ).then((rows) => (rows || []).map((r) => r.column_name));

    if (userCols.includes('level_id')) {
      await q('ALTER TABLE users RENAME COLUMN level_id TO "levelId"');
    }
  },

  async down(queryInterface, Sequelize) {
    const q = queryInterface.sequelize.query.bind(queryInterface.sequelize);

    const levelCols = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'levels'",
      { type: Sequelize.QueryTypes.SELECT }
    ).then((rows) => (rows || []).map((r) => r.column_name));

    if (levelCols.includes('levelNumber')) {
      await q('ALTER TABLE levels RENAME COLUMN "levelNumber" TO level_number');
    }
    if (levelCols.includes('createdAt')) {
      await q('ALTER TABLE levels RENAME COLUMN "createdAt" TO created_at');
    }
    if (levelCols.includes('updatedAt')) {
      await q('ALTER TABLE levels RENAME COLUMN "updatedAt" TO updated_at');
    }

    const userCols = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'",
      { type: Sequelize.QueryTypes.SELECT }
    ).then((rows) => (rows || []).map((r) => r.column_name));

    if (userCols.includes('levelId')) {
      await q('ALTER TABLE users RENAME COLUMN "levelId" TO level_id');
    }
  }
};
