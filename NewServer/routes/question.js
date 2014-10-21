/*jslint node: true, nomen: true, es5: true */

"use strict";

var Question = require("../models/question.js").model,
	regexp = require("../models/question.js").regexp,
    index = require("./index.js"),
    _ = require("underscore-node");

/**
 * Routes
 */

exports.routes = {};
/*
exports.routes.index = function (req, res, next) {
    res.format({
        html: function () {
            index.algorithms.html.list(req, res, next, Question);
        },
        json: function () {
            index.algorithms.json.list(req, res, next, Question);
        }
    });
};
*/
exports.routes.index = function (req, res, next) {
    var query = { },
        fields = "";
    if (req.attached.type) { query.type = req.attached.type; }
    res.format({
        html: function () {
            index.algorithms.html.list(req, res, next, Question, query, fields);
        },
        json: function () {
            index.algorithms.json.list(req, res, next, Question, query, fields);
        }
    });
};


exports.routes.add = function (req, res, next) {
    var obj = {question_text: req.attached.question_text, correct_answer: req.attached.correct_answer, type: req.attached.type};
    if (req.attached.question === undefined) {
        res.format({
            html: function () {
                index.algorithms.html.add(req, res, next, Question, obj);
            },
            json: function () {
                index.algorithms.json.add(req, res, next, Question, obj);
            }
        });
    } else {
        res.format({
            html: function () {
                res.send(501, "not implemented");
            },
            json: function () {
                res.send({ status: "OK", id: req.attached.question.id});
            }
        });
    }
};

exports.routes.get = function (req, res, next) {
    res.format({
        html: function () {
            index.algorithms.html.get(req, res, next, Question);
        },
        json: function () {
            var populate;
            if (req.attached.populate) {
                populate = "answers";
            }
            index.algorithms.json.get(req, res, next, Question, populate);
        }
    });
};

exports.routes.addAnswer = function (req, res, next) {
    var query = {},
        update = {},
        options = {};
    if (req.attached.question) { query._id = req.attached.question.id; }
    if (req.attached.answer) { update = {$addToSet: {answers: req.attached.answer.id }}; }
    res.format({
        html: function () {
            index.algorithms.html.update(req, res, next, Question, query, update, options);
        },
        json: function () {
            index.algorithms.json.update(req, res, next, Question, query, update, options);
        }
    });
};

exports.routes.removeAnswer = function (req, res, next) {
    var query = {},
        update = {},
        options = {};
    if (req.attached.question) { query._id = req.attached.question.id; }
    if (req.attached.answer) { update = {pull: {answers: req.attached.answer.id }}; }
    res.format({
        html: function () {
            index.algorithms.html.update(req, res, next, Question, query, update, options);
        },
        json: function () {
            index.algorithms.json.update(req, res, next, Question, query, update, options);
        }
    });
};

/**
 * Url Params
 */

exports.params = {};

exports.params.id = index.params.id(Question);

/**
 * Query Params
 */

exports.query = {
    mandatory: {},
    optional: {},
    route: {}
};

exports.query.mandatory.id = index.query.register(Question.pname, index.query.mandatory.id(Question), "id");
exports.query.optional.id = index.query.register(Question.pname, index.query.optional.id(Question), "id");
exports.query.optional.type = index.query.register("type", index.query.optional.regexp("type", regexp.query.type, "Question Type"));


/**
 * Body Params
 */

exports.body = {
    mandatory: {},
    optional: {},
    route: {
        add: {}
    }
};

exports.body.mandatory.id = index.body.mandatory.id(Question);

exports.body.route.add.question_text = index.body.mandatory.string("question_text");
exports.body.route.add.correct_answer = index.body.mandatory.string("correct_answer");
exports.body.route.add.type = index.body.mandatory.string("type");


