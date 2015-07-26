var path = require('path');
var models = require('../models/models.js');

var dirname = path.resolve(path.dirname());

// GET /quizes/statistics
exports.stats = function (req, res) {
	var stats = {};
	var route = path.join(dirname, 'views/quizes/stats.ejs');

	models.Quiz.count().then(function (nq) {
		stats.numQuestions = nq;
		models.Comment.count().then(function (nc) {
			stats.numComments = nc;
			stats.avgComments = (nc / nq).toFixed(2);
			models.Comment.aggregate('QuizId', 'count', {distinct: true}).then(function (nqc) {
				stats.numQuestionsWithComments = nqc;
				stats.numQuestionsWithoutComments = nq - nqc;
				res.render(route, {stats: stats, errors: []});
			});
		});
	});
};
