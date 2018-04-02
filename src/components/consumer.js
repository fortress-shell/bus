'use strict';

/**
 * Consumer
 */
class Consumer {
  /**
   * Abstract class for all consumers
   * @param  {Object} amqp    amqp connection
   * @param  {Object} options options
   */
  constructor(amqp, options) {
    this.amqp = amqp;
    this.options = options;
    this.ch = null;
  }
  /**
   * Initialized consumer with channel
   */
  async listen() {
    const {options, name, prefetch} = this.options;
    const ch = await this.amqp.createChannel();
    ch.prefetch(prefetch);
    await ch.assertQueue(name, options),
    ch.consume(name, this.consume.bind(this));
    this.ch = ch;
  }
}

module.exports = Consumer;
