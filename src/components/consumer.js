'use strict';

/**
 * Consumer
 */
class Consumer {
  /**
   * Abstract class for all consumers
   * @param  {Object} amqp    amqp connection
   * @param  {Object} options options
   * @param  {Object} ch rabbitmq channel
   */
  constructor(amqp, options, ch = null) {
    this.amqp = amqp;
    this.options = options;
    this.ch = ch;
  }
  /**
   * Initialized consumer with channel
   */
  async listen() {
    const {options, name, prefetch} = this.options;
    this.ch = await this.amqp.createChannel();
    ch.prefetch(prefetch);
    await this.ch.assertExchange(name);
    await this.ch.assertQueue(name, options);
    await this.ch.bindQueue(name, name, name);
    await this.ch.consume(name, this.consume.bind(this));
  }
}

module.exports = Consumer;
