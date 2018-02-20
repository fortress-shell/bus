'use strict';
const io = require('src/resources/io');
const db = require('src/resources/db');
const createAmqpConnection = require('src/resources/rabbit');
const BusController = require('src/controlllers');
const config = require('src/config');
const {name, options, prefetch} = config.get('queue');

(async function main() {
  try {
    const conn = await createAmqpConnection();
    conn.on("error", console.error);
    conn.on("close", console.error);
    const ch = await conn.createChannel();
    const bus = new BusController(io, db, ch);
    ch.prefetch(prefetch);
    ch.assertQueue(name, options);
    ch.consume(name, bus.notify.bind(bus));
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
