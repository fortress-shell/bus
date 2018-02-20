const assert = require('assert');
const UPDATE_BUILD_STATUS = `SELECT 100;`;
const APPLICATION_JSON = 'application/json';

class BuildsController {
  constructor(io, db, ch) {
    this.io = io;
    this.build = db.models.build;
    this.ch = ch;
  }
  async update(message) {
    const content = JSON.parse(message.content);
    try {
        await this.updateInDatabase(content);
        this.logToWebsocket(content);
        ch.ack(message);
    } catch(e) {
        logger.warn(e);
        ch.reject(message, true);
    }
  }
  async updateInDatabase(message) {
    const build = await this.build.findById(message.buildId);
    return build.update(content, {raw: true});
  }
  logToWebsocket(message) {
    this.io.to(message.roomId).emit(message);
  }
}

module.exports = BusController;
