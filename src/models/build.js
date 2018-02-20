const Sequelize = require('sequelize');
const sequelize = require('src/resources/db');

module.exports = sequelize.define('log', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
}, {
  tableName: 'builds',
  underscored: true,
});
