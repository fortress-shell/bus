'use strict';
const io = require('src/resources/io');
const db = require('src/resources/mysql');
const createAmqpConnection = require('src/resources/rabbit');
const BusController = require('src/controlllers');

(async function main() {
  try {
    const conn = await createAmqpConnection();
    conn.on("error", console.error);
    conn.on("close", console.error);
    const ch = await conn.createChannel();
    const bus = new BusController(io, db, ch);
    ch.prefetch(10);
    ch.assertQueue(q, {durable: false});
    ch.consume(q, bus.notify.bind(bus));
    async function onShutdown() {
      conn.close();
      db.close();
    }
    for (const event of ['SIGINT', 'SIGTERM']) {
      process.once(event, onShutdown);
    }
  } catch(e) {
      console.error(e);
      process.exit(1);
  }
})();
