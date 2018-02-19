'use strict';
const socketIoEmitter = require('socket.io-emitter');
const redisClient = require('src/resources/redis');

module.exports = socketIoEmitter(redisClient);
