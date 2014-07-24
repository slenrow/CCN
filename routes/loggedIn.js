module.exports = function(req, res) {
  if(!req.user) res.redirect('/');
};
