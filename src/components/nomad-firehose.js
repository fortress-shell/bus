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
   * @param  {Object} ch rabbitmq channel
   */
  constructor(io, api, amqp, options) {
    super(amqp, options);
    this.io = io;
    this.api = api;
    this.strategies = {
      Started: this.onStarted.bind(this),
      Terminated: this.onTerminated.bind(this),
      Killed: this.onKilled.bind(this),
    };
    this.terminatedStrategies = {
      '0': this.onSuccess.bind(this),
      '1': this.onFailure.bind(this),
      '2': this.onTimeout.bind(this),
      '4': this.onMaintenance.bind(this),
    };
  }
  /**
   * Update status handler
   * @param  {Object} message rabbitmq message object
   */
  async consume(message) {
    const {ch, io, strategies} = this;
    const event = JSON.parse(message.content);
    logger.info(event);
    try {
      const taskEventType = event['TaskEvent']['Type'];
      if (taskEventType in strategies) {
        const {data} = await strategies[taskEventType](event);
        io.to(`user:${data.user_id}`)
          .emit(`builds:${data.build_id}:update`, data)
          .emit('builds:new', data);
      } else {
        logger.log('Event not exists');
      }
      ch.ack(message);
    } catch (e) {
        logger.warn(e);
        ch.reject(message, true);
    }
  }
  /**
   * Fired on start event
   */
  onStarted(event) {
    return this.api.put('/v1/builds/start', event);
  }
  /**
   * [onSuccess description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onSuccess(event) {
    return this.api.put('/v1/builds/success', event);
  }
  /**
   * [onFailure description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onFailure(event) {
    return this.api.put('/v1/builds/fail', event);
  }
  /**
   * [onTimeout description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onTimeout(event) {
    return this.api.put('/v1/builds/timeout', event);
  }
  /**
   * [onError description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  async onMaintenance(event) {
    return this.api.put('/v1/builds/maintenance', event);
  }
  /**
   * Fired on killed event
   */
  async onKilled(event) {
    return this.api.put('/v1/builds/stoped', event);
  }
  /**
   * Fired on terminated event
   */
  async onTerminated(event) {
    const exitCode = event['TaskEvent']['ExitCode'];
    if (exitCode in this.terminatedStrategies) {
      return this.terminatedStrategies[exitCode](event);
    } else {
      logger.log('Exit code not exists');
    }
  }
}

module.exports = NomadFirehose;
