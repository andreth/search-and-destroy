import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Level = sequelize.define('Level', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  levelNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: { min: 1, max: 15 }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  xpRequired: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'levels',
  timestamps: true
});

export default Level;
