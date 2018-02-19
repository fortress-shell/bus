const debug = require('debug');
const info = debug('bus:info');
const warn = debug('bus:warn');
const log = debug('bus:log');
const error = debug('bus:error');

module.exports = {
  info,
  warn,
  log,
  error,
};
