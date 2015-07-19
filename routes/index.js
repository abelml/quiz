var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quizController.js');
var commentController = require('../controllers/commentController.js');
var sessionController = require('../controllers/sessionController.js');

// GET home page
router.get('/', function(req, res) {
	res.render('index', {title: 'Quiz', errors: []});
});

router.param('quizId', quizController.load);

// Rutas de sesión
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

// Rutas de quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.get('/author', function (req, res) {
	res.render('author', {author: 'Abel Martos López', errors: []});
});

router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

// Rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
