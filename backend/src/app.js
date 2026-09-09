const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Request logging (logs every HTTP request/response via Pino)
app.use(
  pinoHttp({
    logger,
    autoLogging: process.env.NODE_ENV !== 'test',
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Notes API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 404 + global error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
