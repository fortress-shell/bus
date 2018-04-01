'use strict';
const logger = require('src/utils/logger');
const Consumer = require('./consumer');

/**
 * Builds consumer
 */
class MessageBus extends Consumer {
  /**
   * Builds constructor
   * @param  {Object} io socket.io emitter
   * @param  {Object} ch rabbitmq channel
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
    this.io.to(event.user_id).emit(event.type, event.payload);
    this.ch.ack(message);
  }
}

module.exports = MessageBus;
