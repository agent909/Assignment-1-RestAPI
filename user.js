var Sequelize = require('sequelize');
var connection = new Sequelize('postgres://postgres:@localhost:5432/dbase');

var User = connection.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: Sequelize.STRING, allowNull: false},
  password: {type: Sequelize.STRING, allowNull: false}
});


User.create({ name: 'Juliet', password: 'pass2' }).then(function(task) {
  // you can now access the newly created task via the variable task
});

connection.sync();

module.exports = User;