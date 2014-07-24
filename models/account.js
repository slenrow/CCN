var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var plm = require('passport-local-mongoose');

var db = mongoose.createConnection('mongodb://localhost/users');

var Account = new Schema({
	name: String,
	email: String,
	username: String,
	school: String,
	standing: String,
	time: { type: Date, default: Date.now },
	chatGroups: [String]
});

Account.plugin(plm);

module.exports = db.model('Account', Account);