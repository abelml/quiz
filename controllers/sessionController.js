var path = require('path');

var dirname = path.resolve(path.dirname());

// GET /login
exports.new = function (req, res) {
	var errors = req.session.errors || [];
	req.session.errors = [];
	var route = path.join(dirname, 'views/sessions/new.ejs');
	res.render(route, {errors: errors});
};

// POST /login
exports.create = function (req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var userController = require('../controllers/userController.js');

	userController.authenticate(login, password, function (error, user) {
		if (error) {
			req.session.errors = [{'message': 'Se ha producido un error: ' + error}];
			res.redirect('/login');
			return;
		}
		req.session.user = {id: user.id, username: user.username};
		res.redirect(req.session.redir);
	});
};

// GET /logout
exports.destroy = function (req, res) {
	delete req.session.user;
	res.redirect(req.session.redir);
};

exports.loginRequired = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};
