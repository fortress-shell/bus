const assert = require('assert');
const UPDATE_BUILD_STATUS = `SELECT 100;`;
const APPLICATION_JSON = 'application/json';

class BusController {
  constructor(io, db, ch) {
    this.io = io;
    this.db = db;
    this.ch = ch;
  }
  async notify(msg) {
    assert.equal(APPLICATION_JSON, msg.properties.contentType);
    const content = JSON.parse(msg.content);
    await db.query(UPDATE_BUILD_STATUS, {
      replacements: content,
      type: db.QueryTypes.INSERT,
    });
    io.to(content.roomId).emit(content);
    ch.ack(msg);
  }
}

module.exports = BusController;
