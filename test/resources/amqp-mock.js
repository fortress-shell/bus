const channel = {
  prefetch() {
  },
  assertQueue() {
  },
  consume() {
  },
  ack() {
    console.log();
  },
  reject() {
  },
};
const amqp = {
  createChannel() {
    return channel;
  },
};

module.exports = {
  amqp,
  channel,
};
