require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');
const logger = require('./utils/logger');
require('./models'); // register model associations

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Keep tables in sync with models during development.
  // For production, prefer explicit migrations instead of sync({ alter: true }).
  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: true });
    logger.info('Database schema synced (development mode).');
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error({ err }, 'Unhandled Rejection - shutting down server');
    server.close(() => process.exit(1));
  });
};

startServer();
