const MessageBus = require('src/components/message-bus');
const {amqp} = require('test/resources/amqp-mock');
const io = require('test/resources/io-mock');

describe(MessageBus.name, function() {
  describe('#consume()', function() {
    it('should consume message and ack it via channel', async function() {
      const event = {
        user_id: 1,
        project_id: 1,
      };
      const message = {
        content: JSON.stringify(event),
      };
      const messageBus = new MessageBus(io, amqp, {});
      try {
        await messageBus.listen();
      } catch (e) {
        console.error(e);
      }
      messageBus.consume(message);
    });
  });
});
