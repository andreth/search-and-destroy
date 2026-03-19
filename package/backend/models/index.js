import sequelize from '../config/database.js';
import User from './user.js';
import Level from './level.js';
import Tank from './tank.js';
import Plane from './plane.js';
import Resource from './resource.js';

User.belongsTo(Level, { foreignKey: 'levelId' });
Level.hasMany(User, { foreignKey: 'levelId' });

export { sequelize, User, Level, Tank, Plane, Resource };
export default { sequelize, Sequelize: sequelize.constructor, User, Level, Tank, Plane, Resource };
