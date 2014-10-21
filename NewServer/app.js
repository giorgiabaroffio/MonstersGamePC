/*jslint node: true, nomen: true, es5: true */

"use strict";
/**
 * Module dependencies.
 */

var clc = require("cli-color");
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var mongooseAI = require('mongoose-auto-increment');
var app = express();
var path = require('path');

/**
 * Configuration
 */

var env = process.env.NODE_ENV || 'development';

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

/**
 * DB
 */

var db = process.env.db || "mongodb://localhost:27017/test";

var connection = mongoose.connect(db);
// When successfully connected
mongoose.connection.once('open', function () {
    console.log(clc.green("Connected to database at: ") + db);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log(clc.red('Mongoose default connection error: ') + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log(clc.red('Mongoose default connection disconnected'));
});

mongooseAI.initialize(connection);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(1);
    });
});

/**
 * Routes
 */

var index = require("./routes");

app.route("/").get(index.routes.index);
app.use(index.middlewares.init);

var question = require("./routes/question.js");
var answer = require("./routes/answer.js");
var monster = require("./routes/monster.js");
app.param("questionId", question.params.id);
app.param("answerId", answer.params.id);
app.param("monsterId", monster.params.id);


/**
 * Question Routes
 */
app.route("/question")
    .get(index.query.optional.count,
        index.query.optional.since_id,
        index.query.optional.max_id,
		question.query.optional.type,
        question.routes.index)
    .post(question.body.route.add.question_text,
          question.body.route.add.correct_answer,
		  question.body.route.add.type,
          question.routes.add);
app.route("/question/:questionId")
    .get(index.query.optional.populate,
        question.routes.get);
app.route("/question/:questionId/answer")
    .post(answer.body.mandatory.id,
          question.routes.addAnswer)
    .delete(question.body.mandatory.id,
            question.routes.removeAnswer);
app.route("/question/:questionId/answer/:answerId")
    .delete(question.routes.removeAnswer);
	
/**
 * Answer Routes
 */
app.route("/answer")
    .get(index.query.optional.count,
        index.query.optional.since_id,
        index.query.optional.max_id,
        answer.routes.index)
    .post(answer.body.route.add.answer_text,
          answer.routes.add);
app.route("/answer/:answerId")
    .get(answer.routes.get);
	
	
/**
 * Monster Routes
 */
app.route("/monster")
    .get(index.query.optional.count,
        index.query.optional.since_id,
        index.query.optional.max_id,
        monster.routes.index)
    .post(monster.body.route.add.name,
		  monster.body.route.add.type,
          monster.routes.add);
app.route("/monster/:monsterId")
    .get(monster.routes.get);


/**
 * Static Files
 */

app.use('/static', express.static(__dirname + '/public'));

/**
 * Storage
 * This files are the one uploaded to the server
 */

app.use('/storage', express.static(__dirname + '/storage'));

/**
 *Error Handling
 */

app.use(index.routes.invalidRoute);

if ('development' === env) {
    app.use(index.errorHandler({ dumpExceptions: true, showStack: true }));
} else if ('production' === env) {
    app.use(index.errorHandler());
} else {
    console.error(clc.red("Unknown environment: ") + env);
    process.exit(1);
}

/**
 * Server initialization
 */

var port = process.env.port || 3000;

app.listen(port, function () {
    console.log(clc.green("Express server listening on port ") + "%d" + clc.green(" in ") + "%s" + clc.green(" mode"), port, app.settings.env);
});
