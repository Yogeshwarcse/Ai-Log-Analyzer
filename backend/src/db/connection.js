const path = require('path');
const fs = require('fs');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const config = require('../config/env');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    const directory = path.dirname(config.databasePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    dbPromise = open({
      filename: config.databasePath,
      driver: sqlite3.Database,
    });
  }

  return dbPromise;
}

module.exports = {
  getDb,
};

