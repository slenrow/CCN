var express = require('express');
var router = express.Router();
var passport = require('passport');
var ChatGroup = require('../models/chatGroup.js');
var Account = require('../models/account.js');
var loggedIn = require('./loggedIn.js');

/* GET main chat page. */
router.get('/', function(req, res) {
  loggedIn(req, res);

  res.render('chat', {
    title: 'Chat',
  });
});

/* GET new chat page. */
router.get('/new', function(req, res) {
  loggedIn(req, res);

  res.render('newchat', {
    title: 'New Chat'
  });
});

/* POST new chat page. */
router.post('/new', function(req, res) {
  loggedIn(req, res);

  // Create a complete list of members for the group.  var members = [req.user.username];
  var members = [req.user.username];
  if(typeof(req.body.members) === 'array') {
    for(var i=0; i < req.body.members.length; i++) {
      members.push(req.body.members[i]);
    }
  }
  else { members.push(req.body.members); }

  console.log('creating group for...');
  console.log(members);

  var group = new ChatGroup({ members: members });
  var groupID = group.id;

  // Update all member's accounts with the groupID
  /*
  for(var i=0; i < members.length; i++) {
    Account.findOne({ username: members[i] }, 'chatGroups', function(err, person) {
      console.log(person);
      //if(err) res.send("Group could not be created");
      //person.chatGroups.push(groupID);
    });
  }

  // Save to db.
  group.save(function (err) {
    if (err) res.send("Group could not be created");
  });
  */

  res.redirect('/chat');
});

module.exports = router;
