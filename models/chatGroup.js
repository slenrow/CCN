var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost/ccn');

var groupStructure = new Schema({
  name: String,
  owners: [String],
  members: [String],
  messages: [String]
});

var chatGroup = db.model('chatGroup', groupStructure);

module.exports = chatGroup;
