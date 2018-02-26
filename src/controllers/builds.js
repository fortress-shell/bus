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
    const content = JSON.parse(message.content);
    try {
        this.io.to(content.roomId).emit(content);
        this.ch.ack(message);
        logger.info(content);
    } catch (e) {
        logger.warn(e);
        this.ch.reject(message, true);
    }
  }
}

module.exports = BuildsController;
