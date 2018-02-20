const logger = require('src/utils/logger');

/**
 * Builds controller
 */
class BuildsController {
    /**
     * Builds constructor
     * @param  {Object} io [description]
     * @param  {Object} db [description]
     * @param  {Object} ch [description]
     */
  constructor(io, db, ch) {
    this.io = io;
    this.build = db.models.build;
    this.ch = ch;
  }
  /**
   * Update status handler
   * @param  {Object} message [description]
   */
  async consume(message) {
    try {
      const content = JSON.parse(message.content);
    } catch (e) {
      logger.warn(e);
      return this.ch.reject(message, false);
    }
    try {
        await this.updateInDatabase(content);
        this.logToWebsocket(content);
        this.ch.ack(message);
    } catch (e) {
        logger.warn(e);
        this.ch.reject(message, true);
    }
  }
  /**
   * Updates status of build in database
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  async updateInDatabase(message) {
    const build = await this.build.findById(message.buildId);
    return build.update(content, {raw: true});
  }
  /**
   * Updates status of build in UI via ws
   * @param  {Object} message [description]
   */
  logToWebsocket(message) {
    this.io.to(message.roomId).emit(message);
  }
}

module.exports = BuildsController;
