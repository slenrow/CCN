var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var Schema = mongoose.Schema;

resourceSchema = new mongoose.Schema({
filename: String,
files: [ mongoose.Schema.Mixed ]
});


module.exports = mongoose.model('resourceSchema', resourceSchema);