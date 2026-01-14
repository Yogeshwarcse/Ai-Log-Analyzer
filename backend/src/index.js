const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/env');
const { runMigrations } = require('./db/migrations');
const logRoutes = require('./routes/logRoutes');
const errorHandler = require('./middlewares/errorHandler');

async function bootstrap() {
  await runMigrations();

  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/logs', logRoutes);

  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

