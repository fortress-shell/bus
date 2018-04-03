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
   * @param  {Object} options rabbitmq options
   * @param  {Object} ch rabbitmq channel
   */
  constructor(io, amqp, options, ch) {
    super(amqp, options, ch);
    this.io = io;
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   */
  async consume(message) {
    const event = JSON.parse(message.content);
    this.io.to(`user:${event.user_id}`)
      .emit(`builds:${event.project_id}:new`, event);
    this.ch.ack(message);
  }
}

module.exports = MessageBus;
