'use strict';
const Sequalize = require('sequalize');
const config = require('src/config');
const DB_URL = config.get('DB_URL');

module.exports = new Sequalize(DB_URL, {
  dialect: 'mysql',
});
