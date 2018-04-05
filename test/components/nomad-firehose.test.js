const sinon = require('sinon');
const NomadFirehose = require('src/components/nomad-firehose');
const api = require('src/resources/api');
const {amqp, channel} = require('test/resources/amqp-mock');
const io = require('test/resources/io-mock');

describe(NomadFirehose.name, function() {
  beforeEach(function() {
    this.response = {
      data: {
        user_id: 1,
        build_id: 1,
      },
    };
    this.event = {
      status: 'updated',
    };
    const postStub = sinon.stub(api, 'post');
    postStub.returns(this.response);
    sinon.spy(channel, 'ack');
    sinon.spy(io, 'to');
    sinon.spy(io, 'emit');
  });
  afterEach(function() {
    io.to.restore();
    io.emit.restore();
    api.post.restore();
    channel.ack.restore();
  });
  describe('#consume()', function() {
    it('should consume channel and ack it via channel', async function() {
      const message = {
        content: JSON.stringify(this.event),
      };
      const nomadFirehose = new NomadFirehose(io, api, amqp, {});
      await nomadFirehose.listen();
      await nomadFirehose.consume(message);
      channel.ack.calledOnce.should.be.true;
      const emittedRoom = `user:${this.response.data.user_id}`;
      const emittedEvent = `build:${this.response.data.build_id}:update`;
      const emittedData = this.response.data;
      io.to.calledWith(emittedRoom).should.be.true;
      io.emit.calledWith(emittedEvent, emittedData).should.be.true;
    });
  });
});
