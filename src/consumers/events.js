'use strict';
const logger = require('src/utils/logger');
const Consumer = require('./consumer');

/**
 * Builds consumer
 */
class EventsConsumer extends Consumer {
  /**
   * Builds constructor
   * @param  {Object} io socket.io emitter
   * @param  {Object} ch rabbitmq channel
   */
  constructor(io, amqp, options, queueName, prefetchCount) {
    super(amqp, options, queueName, prefetchCount);
    this.io = io;
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   */
  async consume(message) {
    const event = JSON.parse(message.content);
    this.io.to(event.room_id).emit(`${event.source}:${event.type}`, event);
    logger.info(event);
  }
}

module.exports = BuildsConsumer;
