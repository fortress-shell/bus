'use strict';
const debug = require('debug');

exports.info = debug('bus:info');
exports.warn = debug('bus:warn');
exports.log = debug('bus:log');
exports.error = debug('bus:error');
