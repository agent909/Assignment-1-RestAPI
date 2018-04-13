var Sequelize = require('sequelize');
var connection = new Sequelize('postgres://postgres:@localhost:5432/dbase');

module.exports = connection;