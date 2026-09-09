const { sequelize } = require('../config/db');
const User = require('./User');
const Note = require('./Note');

User.hasMany(Note, { foreignKey: 'userId', as: 'notes', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = {
  sequelize,
  User,
  Note,
};
