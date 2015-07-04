var path = require('path');
var models = require('../models/models.js');

var dirname = path.resolve(path.dirname());

// GET /quizes/question/
exports.question = function (req, res) {
	var route = path.join(dirname, 'views/quizes/question');
	models.Quiz.findAll().success(function (quiz) {
		res.render(route, {pregunta: quiz[0].pregunta});
	});
};

// GET /quizes/answer/
exports.answer = function (req, res) {
	var route = path.join(dirname, 'views/quizes/answer');
	models.Quiz.findAll().success(function (quiz) {
		var result = req.query.respuesta === quiz[0].respuesta ? 'Correcto' : 'Incorrecto';
		res.render(route, {respuesta: result});
	});
};
