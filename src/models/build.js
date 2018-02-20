'use strict';
module.exports = (sequelize, DataTypes) => sequelize.define('log', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
}, {
  tableName: 'builds',
  underscored: true,
});
