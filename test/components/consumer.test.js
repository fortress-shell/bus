const Consumer = require('src/components/consumer');
const {channel, amqp} = require('test/resources/amqp-mock.js');

/* eslint-disable */
class ConsumerMock extends Consumer {
  constructor(amqp, options) {
    super(amqp, options);
  }
  consume() {
  }
}
/* eslint-enable */

describe(Consumer.name, function() {
  describe('#listen()', function() {
    it('should assign channel as a result to consumer', async function() {
      const consumerMock = new ConsumerMock(amqp, {});
      consumerMock.should.have.property('ch', null);
      await consumerMock.listen();
      consumerMock.should.have.property('ch', channel);
    });
  });
});
