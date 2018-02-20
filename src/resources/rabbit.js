const amqplib = require('amqplib');
const config = require('config');
const RABBIT_URL = config.get('RABBIT_URL');

/**
 * Creates rabbitmq connection with preparead connection url
 * @return {Promise} rabbitmq connection instance
 */
function createAmqpConnection() {
  return amqplib.connect(RABBIT_URL);
}

module.exports = createAmqpConnection;
