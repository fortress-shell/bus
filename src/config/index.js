'use strict';
const nconf = require('nconf');
const path = require('path');
nconf.env([
  'BASE_URL',
  'API_TOKEN',
  'NODE_ENV',
  'REDIS_URL',
  'RABBITMQ_URL',
  'DATABASE_URL',
]);
nconf.defaults({
  NODE_ENV: 'development',
});
nconf.required([
  'BASE_URL',
  'API_TOKEN',
  'API_URL',
  'REDIS_URL',
  'RABBITMQ_URL',
  'DATABASE_URL',
]);
const NODE_ENV = nconf.get('NODE_ENV');
nconf.file(NODE_ENV, {
  file: path.join(__dirname, `${NODE_ENV}.json`),
});
nconf.file('default', {
  file: path.join(__dirname, 'default.json'),
});

module.exports = nconf;
