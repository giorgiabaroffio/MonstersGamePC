/*jslint node: true, nomen: true, es5: true */

"use strict";

var Answer = require("../models/answer.js").model,
    index = require("./index.js"),
    _ = require("underscore-node");

/**
 * Routes
 */

exports.routes = {};

exports.routes.index = function (req, res, next) {
    res.format({
        html: function () {
            index.algorithms.html.list(req, res, next, Answer);
        },
        json: function () {
            index.algorithms.json.list(req, res, next, Answer);
        }
    });
};

exports.routes.add = function (req, res, next) {
    var obj = {answer_text: req.attached.answer_text};
    if (req.attached.answer === undefined) {
        res.format({
            html: function () {
                index.algorithms.html.add(req, res, next, Answer, obj);
            },
            json: function () {
                index.algorithms.json.add(req, res, next, Answer, obj);
            }
        });
    } else {
        res.format({
            html: function () {
                res.send(501, "not implemented");
            },
            json: function () {
                res.send({ status: "OK", id: req.attached.answer.id});
            }
        });
    }
};

exports.routes.get = function (req, res, next) {
    res.format({
        html: function () {
            index.algorithms.html.get(req, res, next, Answer);
        },
        json: function () {
            index.algorithms.json.get(req, res, next, Answer);
        }
    });
};



/**
 * Url Params
 */

exports.params = {};

exports.params.id = index.params.id(Answer);

/**
 * Query Params
 */

exports.query = {
    mandatory: {},
    optional: {},
    route: {}
};

exports.query.mandatory.id = index.query.register(Answer.pname, index.query.mandatory.id(Answer), "id");
exports.query.optional.id = index.query.register(Answer.pname, index.query.optional.id(Answer), "id");

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

exports.body.mandatory.id = index.body.mandatory.id(Answer);
exports.body.route.add.answer_text = index.body.mandatory.string("answer_text");

