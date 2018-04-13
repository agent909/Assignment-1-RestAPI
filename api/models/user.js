var Sequelize = require('sequelize');
var connection = require('../models/config');

connection
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


var User = connection.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: Sequelize.STRING, allowNull: false, unique: true},
  password: {type: Sequelize.STRING, allowNull: false}
});

connection.sync();

module.exports = User;