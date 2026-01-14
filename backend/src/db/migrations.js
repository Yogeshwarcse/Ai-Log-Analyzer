const path = require('path');
const fs = require('fs');
const { getDb } = require('./connection');

async function runMigrations() {
  const db = await getDb();
  const schemaPath = path.resolve(__dirname, '..', '..', '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  await db.exec(schema);
}

module.exports = {
  runMigrations,
};

