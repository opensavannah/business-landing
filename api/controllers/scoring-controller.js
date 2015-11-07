"use strict";

var querystring = require('querystring');
var request = require('request');
var _ = require('underscore');
var util = require('../util.js');

module.exports = function(req, res) {
    // If a zip code wasn't provided, return an error. We need data from
    // the zip code for scoring to work.
    if (!req.query.hasOwnProperty('zip')) {
        res.send(JSON.stringify({
            success: false
        }));
        return;
    }

    var score = 1.0;
    if (req.query.hasOwnProperty('pop')) {
        // TODO: Put in actual population data based on the zip code.
        var populationDifference = Math.abs(50000 - req.query.pop);
        score =  1.0 / (1.0 + (populationDifference / 100000.0));
    }

    res.send(JSON.stringify({
        success: true,
        score: score
    }));
};
