const sequelize = require('../config/database');
const User = require('./user');

// Add more models here as they are created

const db = {
  sequelize,
  Sequelize: sequelize.constructor,
  User
};

// Handle associations if needed later
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

module.exports = db;
