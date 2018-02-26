'use strict';
const io = require('src/resources/io');
const createAmqpConnection = require('src/resources/rabbit');
const BuildsController = require('src/controllers/builds');
const config = require('src/config');
const logger = require('src/utils/logger');
const {name, options, prefetch} = config.get('queue');

/**
 * Main function
 */
async function main() {
  try {
    const conn = await createAmqpConnection();
    conn.on('error', onShutdown);
    const ch = await conn.createChannel();
    const builds = new BuildsController(io, ch);
    ch.prefetch(prefetch);
    ch.assertQueue(name, options);
    ch.consume(name, builds.consume.bind(builds));
    /**
     * Graceful shutdown handler
     * @param  {Error} err reason
     */
    async function onShutdown(err) {
      if (err) {
        logger.warn('Smth bad happened!');
      } else {
        logger.info('Shutting down!');
      }
      await conn.close();
      process.exit(err ? 1 : 0);
    }
    process.once('SIGINT', onShutdown);
  } catch (e) {
      logger.warn(e);
      process.exit(1);
  }
}

main();
