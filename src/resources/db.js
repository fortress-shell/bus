'use strict';
const pgp = require('pg-promise')
const config = require('src/config');
const DB_URL = config.get('DB_URL');
const db = pgp(DB_URL);

module.exports = db;
