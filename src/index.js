'use strict';
const Promise = require('bluebird');
const config = require('src/config');
const api = require('src/resources/api');
const io = require('src/resources/io');
const createAmqpConnection = require('src/resources/rabbit');
const BuildsConsumer = require('src/consumers/builds');
const EventsConsumer = require('src/consumers/events');
const logger = require('src/utils/logger');

/**
 * Main function
 */
async function main() {
  const eventsQueueOptions = config.get('queues:events');
  const buildsQueueOptions = config.get('queues:builds');
  try {
    const amqp = await createAmqpConnection();
    amqp.on('error', onShutdown);

    await Promise.all([
        new BuildsConsumer(io, api, amqp, eventsQueueOptions),
        new EventsConsumer(io, amqp, buildsQueueOptions),
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
