/*jslint node: true, nomen: true, es5: true */

"use strict";

var mongoose = require("mongoose");
var mongooseAI = require("mongoose-auto-increment");

exports.regexp = { params: {}, query: {}};

exports.regexp.query.type = /0|1|2$/;

var schema = mongoose.Schema({ _id: { type: Number, min: 0, index: { unique: true }, select: false},
                                question_text: { type: String, index: { unique: false }},
                                answers : [{type: Number, min: 0, ref: "Answer"}],
								correct_answer : { type: Number, min: 0},
								type: { type: Number, min: 0, index: { unique: false }},
                                }, { id: false});

schema.virtual('id').get(function () { return this._id; });

schema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

schema.statics.json_list_property = "questions";
schema.statics.pname = "question";

exports.schema = schema;

schema.plugin(mongooseAI.plugin, { model: 'Question', field: '_id' });

var model = mongoose.model('Question',
                           schema,
                           'Question');

exports.model = model;