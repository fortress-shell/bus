const amqplib = require('amqplib');
const config = require('config');
const RABBIT_URL = config.get('RABBIT_URL');

function createAmqpConnection() {
  return amqplib.connect(RABBIT_URL);
}

module.exports = createAmqpConnection;
