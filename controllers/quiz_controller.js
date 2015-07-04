var path = require('path');
var models = require('../models/models.js');

var dirname = path.resolve(path.dirname());

// Autoload
exports.load = function (req, res, next, quizId) {
	var route = path.join(dirname, 'views/quizes/index');
	models.Quiz.find(quizId).then(function (quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function (error) {
		next(error);
	});
};

// GET /quizes
exports.index = function (req, res) {
	var route = path.join(dirname, 'views/quizes/index');
	models.Quiz.findAll().then(function (quizes) {
		res.render(route, {quizes: quizes});
	}).catch(function (error) {
		next(error);
	});
};

// GET /quizes/question/
exports.show = function (req, res) {
	var route = path.join(dirname, 'views/quizes/show');
	res.render(route, {quiz: req.quiz});
};

// GET /quizes/answer/
exports.answer = function (req, res) {
	var route = path.join(dirname, 'views/quizes/answer');
	var result = req.query.respuesta === req.quiz.respuesta ? 'Correcto' : 'Incorrecto';
	res.render(route, {quiz: req.quiz, result: result});
};
