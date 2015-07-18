var path = require('path');

require('dotenv').load();

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

var sequelize = new Sequelize(DB_name, user, pwd, {
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,	// SQLite
	omitNull: true		// PostgreSQL
});

var dirname = path.resolve(path.dirname());
var Quiz = sequelize.import(path.join(dirname, 'models/quiz.js'));
var Comment = sequelize.import(path.join(dirname, 'models/comment.js'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;
exports.Comment = Comment;

sequelize.sync().then(function () {
	Quiz.count().then(function (count) {
		if (count === 0) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'Otro'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'Otro'
			}).then(function () {
				console.log('Base de datos inicializada');
			});
		}
	});
});
