'use strict';
const logger = require('src/utils/logger');
const Consumer = require('./consumer');

/**
 * Builds controller
 */
class NomadFirehose extends Consumer {
  /**
   * Builds constructor
   * @param  {Object} io socket.io emitter
   * @param  {Object} api rails server api for results of builds
   * @param  {Object} amqp rabbitmq channel
   * @param  {Object} options rabbitmq options
   */
  constructor(io, api, amqp, options) {
    super(amqp, options);
    this.io = io;
    this.api = api;
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   * @return {undefined} empty response
   */
  async consume(message) {
    const {ch, io, api} = this;
    const event = JSON.parse(message.content);
    logger.info(event);
    try {
      const {data} = await api.post('/v1/results', event);
      if (!data) {
        return logger.log('Event not exists', event);
      }
      io.to(`user:${data.user_id}`)
        .emit(`build:${data.build_id}:update`, data);
      ch.ack(message);
    } catch (e) {
        logger.warn(e);
        ch.reject(message, true);
    }
  }
}

module.exports = NomadFirehose;
