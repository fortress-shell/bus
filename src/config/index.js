'use strict';
const dotenv = require('dotenv');
const nconf = require('nconf');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
nconf.env([
  'NODE_ENV',
  'REDIS_URL',
]);
nconf.defaults({
  NODE_ENV: 'development',
});
nconf.required([
  'REDIS_URL',
  'keyb',
]);
const NODE_ENV = nconf.get('NODE_ENV');
nconf.file(NODE_ENV, {
  file: path.join(__dirname, `${NODE_ENV}.json`),
});
nconf.file('default', {
  file: path.join(__dirname, 'default.json'),
});

module.exports = nconf;
