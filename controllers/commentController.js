var path = require('path');
var models = require('../models/models.js');

var dirname = path.resolve(path.dirname());

// Autoload
exports.load = function (req, res, next, commentId) {
	var clause = {
		where: {
			id: Number(commentId)
		}
	};
	models.Comment.find(clause).then(function (comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error('No existe commentId=' + commentId));
		}
	}).catch(function (error) {
		next(error);
	});
};


// GET /quizes/:quizId/comments/new
exports.new = function (req, res) {
	var route = path.join(dirname, 'views/comments/new.ejs');
	res.render(route, {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function (req, res) {
	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});
	var route = path.join(dirname, '/views/comments/new.ejs');
	comment.validate().then(function () {
		comment.save().then(function () {
			res.redirect('/quizes/' + req.params.quizId);
		});
	}).catch(function (err) {
		var errors = [];
		for (var prop in err) {
			errors.push({message: err[prop]});
		}
		res.render(route, {comment: comment, errors: errors});
	});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function (req, res, next) {
	req.comment.publicado = true;
	req.comment.save({fields: ["publicado"]}).then(function () {
		res.redirect('/quizes/' + req.params.quizId);
	}).catch(function (error) {
		next(error);
	});
};
