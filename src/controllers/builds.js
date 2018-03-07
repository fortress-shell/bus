'use strict';
const logger = require('src/utils/logger');

/**
 * Builds controller
 */
class BuildsController {
    /**
     * Builds constructor
     * @param  {Object} io socket.io emitter
     * @param  {Object} ch rabbitmq channel
     */
  constructor(io, ch) {
    this.io = io;
    this.ch = ch;
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   */
  async consume(message) {
    const event = JSON.parse(message.content);
    try {
        this.io.to(event.room_id).emit(`${event.source}:${event.type}`, event);
        this.ch.ack(message);
        logger.info(event);
    } catch (e) {
        logger.warn(e);
        this.ch.reject(message, true);
    }
  }
}

module.exports = BuildsController;
