const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: true },
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      defaultValue: '',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
  },
  {
    sequelize,
    modelName: 'Note',
    tableName: 'notes',
  }
);

module.exports = Note;
