var path = require('path');
var models = require('../models/models.js');

var dirname = path.resolve(path.dirname());

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
	var route = path.join(dirname, '/quizes/comments/new.ejs');
	var err = comment.validate();

	if (err) {
		var errors = [];
		for (var prop in err) {
			errors.push({message: err[prop]});
		}
		res.render(route, {comment: comment, errors: errors});
	} else {
		comment.save().then(function () {
			res.redirect('/quizes/' + req.params.quizId);
		});
	}
};
