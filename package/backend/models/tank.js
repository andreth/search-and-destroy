import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tank = sequelize.define('Tank', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'tanks',
  timestamps: true
});

export default Tank;
