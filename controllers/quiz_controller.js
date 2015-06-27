var path = require('path');

// GET /quizes/question/
exports.question = function (req, res) {
	res.render(path.join(__dirname, '../views/quizes/question'), {pregunta: 'Capital de Italia'});
};

// GET /quizes/answer/
exports.answer = function (req, res) {
	var result = req.query.respuesta === 'Roma' ? 'Correcto' : 'Incorrecto';
	res.render(path.join(__dirname, '../views/quizes/answer'), {respuesta: result});
};
