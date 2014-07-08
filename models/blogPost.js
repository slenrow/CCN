var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var plm = require('passport-local-mongoose');

var blogPost = new Schema({
  
  title:  String,
  username: String,
  content:   String,
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
  meta: {
    votes: Number,
    favs:  Number
  }
});

blogPost.plugin(plm);

module.exports = mongoose.model('blogPost', blogPost);