var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost/ccn');

var groupStructure = new Schema({
  members: [String],
  messages: [String]
});

var ChatGroup = db.model('ChatGroup', groupStructure);

module.exports = ChatGroup;
