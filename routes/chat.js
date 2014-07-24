var express = require('express');
var router = express.Router();
var passport = require('passport');
var chatGroup = require('../models/chatGroup.js');
var loggedIn = require('./loggedIn.js');

/* GET main chat page. */
router.get('/', function(req, res) {
  loggedIn(req, res);

  console.log(req.user);
  console.log(req.session);
  res.render('chat', {
    title: 'Chat',
  });
});

/* POST main chat page. */
router.post('/new', function(req, res) {
  loggedIn(req, res);

  res.redirect('/chat');
});

module.exports = router;
