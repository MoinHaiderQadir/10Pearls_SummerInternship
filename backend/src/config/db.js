const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'notes_app_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: (msg) => logger.debug(msg),
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL connection has been established successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Unable to connect to the MySQL database');
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
