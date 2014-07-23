var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost/ccn');


var blogStructure = new Schema({
  
  title:  String,
  username: String,
  content:   String,
  votes: Number,
  comments: [{ 
      body: String, 
      date: Date, 
      username:String 
    }],
  date: { 
    type: Date, 
    default: Date.now 
  },
  hidden: Boolean,
  favs:  Number
});

var blogPost = db.model('blogPost', blogStructure);


module.exports = blogPost;