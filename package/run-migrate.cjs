'use strict';

const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

const configPath = path.join(__dirname, 'backend', 'config', 'config.cjs');
const migrationsPath = path.join(__dirname, 'backend', 'migrations');

const config = require(configPath);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

function getSequelize() {
  if (dbConfig.use_env_variable) {
    return new Sequelize(process.env[dbConfig.use_env_variable], { dialect: 'postgres' });
  }
  return new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port || 5432,
    dialect: 'postgres',
    logging: false
  });
}

async function run() {
  const sequelize = getSequelize();
  const queryInterface = sequelize.getQueryInterface();

  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  await sequelize.query(
    'CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255) NOT NULL PRIMARY KEY);'
  );

  const [rows] = await sequelize.query('SELECT name FROM "SequelizeMeta" ORDER BY name');
  const executed = new Set();
  (rows || []).forEach((r) => {
    executed.add(r.name);
    executed.add(r.name.replace(/\.js$/, '.cjs'));
    executed.add(r.name.replace(/\.cjs$/, '.js'));
  });

  const files = fs.readdirSync(migrationsPath)
    .filter((f) => f.endsWith('.cjs'))
    .sort();

  for (const file of files) {
    if (executed.has(file)) {
      console.log('Already run:', file);
      continue;
    }
    console.log('Running:', file);
    const migration = require(path.join(migrationsPath, file));
    await migration.up(queryInterface, Sequelize);
    await sequelize.query(
      'INSERT INTO "SequelizeMeta" (name) VALUES (:name)',
      { replacements: { name: file } }
    );
  }

  console.log('Migrations done.');
  await sequelize.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
