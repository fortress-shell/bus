'use strict';
const amqplib = require('amqplib');
const config = require('src/config');
const RABBITMQ_URL = config.get('RABBITMQ_URL');

/**
 * Creates rabbitmq connection with preparead connection url
 * @return {Promise} rabbitmq connection instance
 */
function createAmqpConnection() {
  return amqplib.connect(RABBITMQ_URL);
}

module.exports = createAmqpConnection;
