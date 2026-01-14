const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

const backendRoot = path.resolve(__dirname, '..', '..');
const defaultDbPath = path.resolve(backendRoot, '..', 'database', 'logs.db');
const configuredDbPath = process.env.DATABASE_PATH
  ? path.resolve(backendRoot, process.env.DATABASE_PATH)
  : defaultDbPath;

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openAiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  databasePath: configuredDbPath,
};

module.exports = config;

