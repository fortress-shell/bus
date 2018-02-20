'use strict';
const Sequalize = require('sequalize');
const config = require('src/config');
const DB_URL = config.get('DB_URL');
const path = require('path');
const BUILD_PATH = path.resolve('src/models/log');
const DB_URL = config.get('DB_URL');
const options = config.get('db');
const db = new Sequelize(DB_URL, options);

db.import(BUILD_PATH);

module.exports = new Sequalize(DB_URL, {
  dialect: 'mysql',
  operatorsAliases: false,
});
