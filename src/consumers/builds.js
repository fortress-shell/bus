'use strict';
const logger = require('src/utils/logger');
const Consumer = require('./consumer');
const ALLOCATIONS = '/api/allocations';

/**
 * Builds controller
 */
class BuildsConsumer extends Consumer {
    /**
     * Builds constructor
     * @param  {Object} io socket.io emitter
     * @param  {Object} ch rabbitmq channel
     */
  constructor(io, api, amqp, options, queueName, prefetchCount) {
    super(amqp, options, queueName, prefetchCount);
    this.io = io;
    this.api = api;
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   */
  async consume(message) {
    const event = JSON.parse(message.content);
    try {
        const {data} = await this.api.post(ALLOCATIONS, event);
        this.ch.ack(message);
        this.io.to(data.room_id).emit(`allocation:${data.type}`, data.event);
        logger.info(event);
    } catch (e) {
        logger.warn(e);
        this.ch.reject(message, true);
    }
  }
}

module.exports = BuildsConsumer;
