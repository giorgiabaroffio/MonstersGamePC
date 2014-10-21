/*jslint node: true, nomen: true, es5: true */

"use strict";

var Monster = require("../models/monster.js").model,
    index = require("./index.js"),
    _ = require("underscore-node");

/**
 * Routes
 */

exports.routes = {};

exports.routes.index = function (req, res, next) {
    res.format({
        html: function () {
            index.algorithms.html.list(req, res, next, Monster);
        },
        json: function () {
            index.algorithms.json.list(req, res, next, Monster);
        }
    });
};

exports.routes.add = function (req, res, next) {
    var obj = {name: req.attached.name, type: req.attached.type};
    if (req.attached.monster === undefined) {
        res.format({
            html: function () {
                index.algorithms.html.add(req, res, next, Monster, obj);
            },
            json: function () {
                index.algorithms.json.add(req, res, next, Monster, obj);
            }
        });
    } else {
        res.format({
            html: function () {
                res.send(501, "not implemented");
            },
            json: function () {
                res.send({ status: "OK", id: req.attached.monster.id});
            }
        });
    }
};

exports.routes.get = function (req, res, next) {
    res.format({
        html: function () {
            index.algorithms.html.get(req, res, next, Monster);
        },
        json: function () {
            index.algorithms.json.get(req, res, next, Monster);
        }
    });
};


/**
 * Url Params
 */

exports.params = {};
exports.params.id = index.params.id(Monster);

/**
 * Query Params
 */

exports.query = {
    mandatory: {},
    optional: {},
    route: {}
};

exports.query.mandatory.id = index.query.register(Monster.pname, index.query.mandatory.id(Monster), "id");
exports.query.optional.id = index.query.register(Monster.pname, index.query.optional.id(Monster), "id");

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

exports.body.route.add.name = index.body.mandatory.string("name");
exports.body.route.add.type = index.body.mandatory.string("type");



