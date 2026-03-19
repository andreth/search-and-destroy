import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Plane = sequelize.define('Plane', {
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
  tableName: 'planes',
  timestamps: true
});

export default Plane;
