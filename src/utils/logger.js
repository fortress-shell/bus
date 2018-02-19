const debug = require('debug');
const info = debug('notifications:info');
const warn = debug('notifications:warn');
const log = debug('notifications:log');
const error = debug('notifications:error');

module.exports = {
  info,
  warn,
  log,
  error,
};
