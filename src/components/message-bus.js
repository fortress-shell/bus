'use strict';
const logger = require('src/utils/logger');
const Consumer = require('src/components/consumer');

/**
 * Builds consumer
 */
class MessageBus extends Consumer {
  /**
   * Builds constructor
   * @param  {Object} io socket.io emitter
   * @param  {Object} amqp rabbit connection
   * @param  {Object} options rabbitmq channel
   */
  constructor(io, amqp, options) {
    super(amqp, options);
    this.io = io;
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   */
  async consume(message) {
    const event = JSON.parse(message.content);
    logger.info(event);
    this.io.to(event.user_id)
      .emit(`builds:${event.project_id}:new`, event);
    this.ch.ack(message);
  }
}

module.exports = MessageBus;
