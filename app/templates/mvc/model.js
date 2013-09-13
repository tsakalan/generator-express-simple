<% if (db === 'mongoose') { %>
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    itemSchema = new Schema({
      itemName: String,
      price: Number
    });

mongoose.model('Items', itemSchema);
<% } else if (db === 'sequelize') { %>
module.exports = function (sequelize, DataTypes) {
  return sequlize.define('Items', {
    itemName: DataTypes.STRING,
    price: DataTypes.INTEGER
  });
};
<% } %>
