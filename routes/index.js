var passport = require('passport');
var Account = require('../models/account');
var blogPost = require('../models/blogPost');
var express = require('express');
var mongoose = require( 'mongoose' );
//var Comment = mongoose.model( 'Comment' );
var router = express.Router();

var content = "";
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
//var ObjectID = require('mongodb').ObjectID


	router.get('/', function (req, res) {
		res.render('index', { title: 'CCN', user: req.user });
	});

	router.get('/ourteam', function (req, res) {
		res.render('ourteam', { title: 'The CCN Crew' });
	});

	router.get('/profile', function (req, res) {
		res.render('profile', {title: 'Directory'})
	});

	router.get('/calendar', function (req, res) {
		res.render('calendar', {title: 'Calendar'})
	});

	router.get('/chat', function (req, res) {
		res.render('chat', {title: 'Chat'})
	});

	router.post('/register', function (req, res) {

		var validEmail = req.body.email;
		var atSign = validEmail.indexOf("@");
		var dotEdu = validEmail.lastIndexOf(".edu");

		if (dotEdu < atSign) {
			res.render('error', {
				message: 'Please enter a valid .edu email address'
			});
		}

		else {
			Account.register(
				new Account({ 
					name : req.body.name,
					email : req.body.email,
					username : req.body.username,
					institution : req.body
				}),
				req.body.password, function (err, account) {
					if (err) {
						return res.render('error', { 
							message: 'Account already exists. Try logging in.' 
						});
					}

					passport.authenticate('local')(req, res, function () {
						res.redirect('/');
					});
			});
		}
	});

	router.post('/login', passport.authenticate('local'), function (req, res) {
		res.redirect('/');
	});

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/community', function (req, res) {
		res.render('blog', {title: 'Community'});
	});

	router.get('/community/start_ups', function(req, res){ 
		blogPost.find(function(err, allPost){
			if (err)
				res.send(err);
		           
			res.render('start_ups.jade', {
				title: 'Start Ups',
				"posts": allPost
						});
			});    
	});

	router.get("/community/start_ups/new", function(req, res){
		res.render("blog_new.jade", {title: 'New Post'});
	});

	router.post("/community/start_ups/new",function(req,res){
		var bPost = new blogPost();
		bPost.title = req.body.title;
		bPost.content = req.body.content;

		bPost.save(function(err){
			if(err)
				res.send(err);

			console.log(bPost.title);
			console.log(bPost.content);
			res.redirect('/community/start_ups');
			
		});
	});

	router.get('/community/start_ups/:id', function(req, res){
		console.log(req.params.id);
		
		blogPost.findOne({title: req.params.id}, function(err, post){
			console.log(req.params.id);
			res.render('blog_show.jade', {
					post: post,
					comments: post.comments
				});
		});
	});

	router.post('/blog/addComment', function(req,res){
		
			console.log("this is the post id"+req.body.id);
			//console.log(req.body.)
			
			 var comment = {
	       
	        body: req.body.comment, 
	        date: new Date(),
	        username: req.body.person 
	    };
	   
	    blogPost.findOneAndUpdate(
	      { title: req.body.id },
	      { $push: { comments: comment }},
	      { safe: true, upsert: true },
	      function(err, blogModels) {
	        // Handle err
	        });

	    console.log("comment content "+comment);
	    res.redirect('back');
	});

module.exports = router;
