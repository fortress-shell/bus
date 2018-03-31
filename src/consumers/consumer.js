'use strict';

/**
 * Consumer
 */
class Consumer {
  /**
   * [constructor description]
   * @param  {[type]} conn          [description]
   * @param  {[type]} options       [description]
   * @param  {[type]} queueName     [description]
   * @param  {[type]} prefetchCount [description]
   * @return {[type]}               [description]
   */
  constructor(amqp, options, queueName, prefetchCount) {
    this.amqp = amqp;
    this.options = options;
    this.queueName = queueName;
    this.prefetchCount = prefetchCount;
  }
  /**
   * [promise description]
   * @return {[type]} [description]
   */
  async listen() {
    this.ch = await this.amqp.createChannel();
    ch.prefetch(this.prefetchCount);
    await ch.assertQueue(this.queueName, this.options),
    ch.consume(this.queueName, this.consume.bind(this));
  }
}

module.exports = Consumer;
