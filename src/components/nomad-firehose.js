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
   * Fired on start event
   * @param {Object} event event from nomad-firehose
   * @return {Promise} result of async function
   */
  onStarted(event) {
    return this.api.put('/v1/results/start', event);
  }
  /**
   * [onSuccess description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onSuccess(event) {
    return this.api.put('/v1/results/success', event);
  }
  /**
   * [onFailure description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onFailure(event) {
    return this.api.put('/v1/results/fail', event);
  }
  /**
   * [onTimeout description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onTimeout(event) {
    return this.api.put('/v1/results/timeout', event);
  }
  /**
   * [onMaintenance description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  async onMaintenance(event) {
    return this.api.put('/v1/results/maintenance', event);
  }
  /**
   * [onKilled description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  async onKilled(event) {
    return this.api.put('/v1/results/stoped', event);
  }
  /**
   * Fired on terminated event
   * @param {Object} event event from nomad
   * @return {Promise} promise with results or without them
   */
  async onTerminated(event) {
    const exitCode = event['TaskEvent']['ExitCode'];
    if (exitCode in this.terminatedStrategies) {
      return this.terminatedStrategies[exitCode](event);
    } else {
      logger.log('Exit code not exists');
      return null;
    }
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
        if (!data) {
          logger.log('Event not exists');
          return;
        }
        io.to(`user:${data.user_id}`)
          .emit(`build:${data.build_id}`, data);
      } else {
        logger.log('Event not exists');
      }
      ch.ack(message);
    } catch (e) {
        logger.warn(e);
        ch.reject(message, true);
    }
  }
}

module.exports = NomadFirehose;
