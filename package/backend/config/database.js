// Charger .env depuis la racine du repo si on est dans package/
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(process.cwd(), '..', '.env');
dotenv.config({ path: rootEnv });
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
