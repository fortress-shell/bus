'use strict';
const io = require('src/resources/io');
const db = require('src/resources/db');
const createAmqpConnection = require('src/resources/rabbit');
const BuildsController = require('src/controllers/builds');
const config = require('src/config');
const {name, options, prefetch} = config.get('queue');

(async function main() {
  try {
    const conn = await createAmqpConnection();
    conn.on('error', onShutdown);
    const ch = await conn.createChannel();
    const builds = new BuildsController(io, db, ch);
    ch.prefetch(prefetch);
    ch.assertQueue(name, options);
    ch.consume(name, builds.consume.bind(builds));
    /**
     * Graceful shutdown handler
     * @param  {Error} err [description]
     */
    async function onShutdown(err) {
      conn.close();
      db.close();
      process.exit(err ? 1 : 0);
    }
    for (const event of ['SIGINT', 'SIGTERM']) {
      process.once(event, onShutdown);
    }
  } catch (e) {
      console.error(e);
      process.exit(1);
  }
})();
