'use strict';
const io = require('src/resources/io');
const createAmqpConnection = require('src/resources/rabbit');
const BuildsConsumer = require('src/consumers/builds');
const config = require('src/config');
const logger = require('src/utils/logger');
const EVENTS_QUEUE = config.get('EVENTS_QUEUE');
const BUILDS_QUEUE = config.get('BUILDS_QUEUE');
const EVENTS_PREFETCH = parseInt(config.get('EVENTS_PREFETCH'));
const BUILDS_PREFETCH = parseInt(config.get('BUILDS_PREFETCH'));
const api = require('src/resources/api');
const Promise = require('bluebird');
const OPTS = {
  durable: true,
  autoDelete: false,
};

/**
 * Main function
 */
async function main() {
  try {
    const amqp = await createAmqpConnection();
    amqp.on('error', onShutdown);

    await Promise.all([
        new BuildsConsumer(io, api, amqp, OPTS, BUILDS_QUEUE, BUILDS_PREFETCH),
        new EventsConsumer(io, amqp, OPTS, EVENTS_QUEUE, EVENTS_PREFETCH),
      ])
      .map(consumer => consumer.listen());

    process.once('SIGINT', onShutdown.bind(undefined, amqp));
  } catch (e) {
    logger.warn(e);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 * @param  {Error} err reason
 */
async function onShutdown(amqp, err) {
  if (err) {
    logger.warn('Smth bad happened!');
  } else {
    logger.info('Shutting down!');
  }
  await amqp.close();
  process.exit(err ? 1 : 0);
}

main();
