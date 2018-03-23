'use strict';
const Redis = require('ioredis');
const config = require('src/config');
const REDIS_URL = config.get('REDIS_URL');
const sentinels = REDIS_URL.split(',');

if (sentinels.length > 1) {
  module.exports = new Redis({
    name: 'fortress',
    sentinels,
  });
} else if (sentinels.length === 1) {
  module.exports = new Redis(REDIS_URL);
} else {
  throw new TypeError('REDIS_URL!');
}
