var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var telegram = require('telegram-bot-api');
var util = require('util');


const TeleBot = require('telebot');
const bot = new TeleBot('320116308:AAEhK0VgNM7s-DOlAz8xCj6tIxwqady8J2U');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


console.log(bot);

var m = "همممم";

bot.on('text', msg => {
	console.log(msg);
});


bot.on('edited', msg => {
	let fromId = msg.from.id;
	let firstName = msg.from.first_name;
	let reply = msg.message_id;
	return bot.sendMessage(fromId, ``, {
		reply
	});
});

bot.on('/hello', msg => {
	let [cmdName, firstName, lastName] = msg.text.split(' ');
	return bot.sendMessage(msg.from.id, `Hello, ${ firstName } ${ lastName }!`);
});


bot.on('text', msg => {
	if (msg.text == "choose") {
		let markup = bot.inlineKeyboard([
			[
				bot.inlineButton('همممم', {
					callback: 'hm'
				}),
				bot.inlineButton('هومممم', {
					callback: 'hum'
				})
			]
		]);

		return bot.sendMessage(msg.from.id, 'انتخاب کنید.', {
			markup
		});

	} else if (msg.text == "hi") {
		return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }!`);
	} else {
		return bot.sendMessage(msg.from.id, `${ m }`);
	}
});

bot.on('callbackQuery', msg => {
	// User message alert
	console.log(msg);
	if (msg.data == "hm")
		m = "همممم";
	if (msg.data == 'hum')
		m = "هومممم";

	return bot.answerCallback(msg.id, `انتخاب شما ثبت شد.`, true);

});


bot.connect();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;