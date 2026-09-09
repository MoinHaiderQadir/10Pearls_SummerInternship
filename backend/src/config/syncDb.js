/**
 * Run this script manually to create/update MySQL tables from Sequelize models:
 *   npm run db:migrate
 */
require('dotenv').config();
const { sequelize } = require('./db');
const logger = require('../utils/logger');
require('../models'); // ensures models + associations are registered

(async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info('Database synced successfully.');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Database sync failed');
    process.exit(1);
  }
})();
