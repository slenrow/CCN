var passport = require('passport');
var Account = require('./models/account');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

module.exports = function (app) {


	app.get('/', function (req, res) {
		res.render('index', { title: 'CCN', user: req.user });
	});

	app.get('/', function (req, res){
		res.render('chat', {title : "Chat"});
	});

	app.get('/ourteam', function (req, res) {
		res.render('ourteam', { title: 'The CCN Crew' });
	});

	app.get('/profile', function (req, res) {
		res.render('profile', {title: 'Directory'});
	});

	app.post('/register', function (req, res) {

		var validEmail = req.body.email;
		var atSign = validEmail.indexOf("@");
		var dotEdu = validEmail.indexOf(".edu");

		if (dotEdu < 0 || dotEdu < atSign) {
			res.send("Must enter valid .edu email address");
		}
		else
			Account.register(
				new Account({ 
					name : req.body.name,
					email : req.body.email,
					username : req.body.username 
				}),
				req.body.password, function (err, account) {
					if (err) {
						return res.render('error', { 
							message: 'Something happened. Check to make sure all fields were filled in or try logging in.' 
						});
					}

					passport.authenticate('local')(req, res, function () {
						res.redirect('/');
					});
			});
	});

	app.post('/login', passport.authenticate('local'), function (req, res) {
		res.redirect('/');
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	var articleProvider= new ArticleProvider('localhost', 27017);

	app.get('/blog', function(req, res){    
		articleProvider.findAll( function(error,docs){        
			res.render('blog.jade', {title: 'Blog', articles:docs});    
	})});

	app.get('/blog/new', function(req, res) {
    	res.render('blog_new.jade', { locals: {
        	title: 'New Post'
    	}
    	});
	});

	app.post('/blog/new', function(req, res){
	    articleProvider.save({
	        title: req.param('title'),
	        body: req.param('body')
	    }, function( error, docs) {
	        res.redirect('/blog')
	    });
	});

	app.get('/blog/:id', function(req, res) {
	    articleProvider.findById(req.params.id, function(error, article) {
	        res.render('blog_show.jade',
	        { locals: {
	            title: article.title,
	            article:article
	        }
	        });
	    });
	});

	app.post('/blog/addComment', function(req, res) {
	    articleProvider.addCommentToArticle(req.param('_id'), {
	        person: req.param('person'),
	        comment: req.param('comment'),
	        created_at: new Date()
	       } , function( error, docs) {
	           res.redirect('/blog/' + req.param('_id'))
	       });
	});

	
};