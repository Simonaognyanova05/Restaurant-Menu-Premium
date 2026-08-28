const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
