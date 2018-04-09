'use strict';
const logger = require('src/utils/logger');
const Consumer = require('src/components/consumer');

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
   * @param  {Object} ch rabbitmq channel
   */
  constructor(io, api, amqp, options, ch) {
    super(amqp, options, ch);
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
    logger.warn(event.JobID, event.TaskEvent.Type);
    try {
      const {data, status} = await api.post('/v1/results', event);
      if (!data) {
        return ch.ack(message);
      }
      io.to(`user:${data.build.user_id}`)
        .emit(`builds:${data.build.id}:update`, data.build);
    } catch (e) {
        if (e.response && e.response.status === 404) {
          logger.warn('job not found', e.response.data);
        } else if (e.response) {
          logger.warn('server error', e.response.data, e.response.status);
        } else {
          logger.warn('event skipped', e);
        }
    }
    ch.ack(message);
  }
}

module.exports = NomadFirehose;
