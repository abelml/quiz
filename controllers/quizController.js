var path = require('path');
var models = require('../models/models.js');

var dirname = path.resolve(path.dirname());

// Autoload
exports.load = function (req, res, next, quizId) {
	var clause = {
		where: {
			id: Number(quizId)
		},
		include: [{
			model: models.Comment
		}]
	};
	models.Quiz.find(clause).then(function (quiz) {
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
exports.index = function (req, res, next) {
	var route = path.join(dirname, 'views/quizes/index.ejs');
	var params = {};
	if (req.query.search) {
		var textToFind = '%' + req.query.search.replace(/\s+/g, '%') + '%'
		params.where = ["pregunta like ?", textToFind];
	}
	models.Quiz.findAll(params).then(function (quizes) {
		res.render(route, {quizes: quizes, errors: []});
	}).catch(function (error) {
		next(error);
	});
};

// GET /quizes/question/
exports.show = function (req, res) {
	var route = path.join(dirname, 'views/quizes/show.ejs');
	res.render(route, {quiz: req.quiz, errors: []});
};

// GET /quizes/answer/
exports.answer = function (req, res) {
	var route = path.join(dirname, 'views/quizes/answer.ejs');
	var result = req.query.respuesta === req.quiz.respuesta ? 'Correcto' : 'Incorrecto';
	res.render(route, {quiz: req.quiz, result: result, errors: []});
};

// GET /quizes/new
exports.new = function (req, res) {
	var route = path.join(dirname, 'views/quizes/new');
	var quiz = models.Quiz.build({
		pregunta: 'Pregunta',
		respuesta: 'Respuesta',
		tema: 'Otro'
	});
	res.render(route, {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	saveQuestion(quiz, 'views/quizes/new.ejs', res);
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var route = path.join(dirname, 'views/quizes/edit.ejs');
	var quiz = req.quiz;
	res.render(route, {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	saveQuestion(req.quiz, 'views/quizes/edit.ejs', res);
};

// DELETE /quizes/:id
exports.destroy = function (req, res, next) {
	req.quiz.destroy().then(function () {
		res.redirect('/quizes');
	}).catch(function (err) {
		next(err);
	});
};

var saveQuestion = function (quiz, myRoute, res) {
	var route = path.join(dirname, myRoute);
	var err = quiz.validate();
	if (err) {
		var errors = [];
		for (var prop in err) {
			errors.push({message: err[prop]});
		}
		res.render(route, {quiz: quiz, errors: errors});
	} else {
		quiz.save({fields: ['pregunta', 'respuesta', 'tema']}).then(function () {
			res.redirect('/quizes');
		});
	}
}
