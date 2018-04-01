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
  constructor(amqp, options) {
    this.amqp = amqp;
    this.options = options;
  }
  /**
   * [promise description]
   * @return {[type]} [description]
   */
  async listen() {
    const { options, name, prefetch } = this.options;
    const ch = await this.amqp.createChannel();
    ch.prefetch(prefetch);
    await ch.assertQueue(name, options),
    ch.consume(name, this.consume.bind(this));
    this.ch = ch;
  }
}

module.exports = Consumer;
