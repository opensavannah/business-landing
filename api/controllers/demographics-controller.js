"use strict";

var querystring = require('querystring');
var request = require('request');
var _ = require('underscore');
var util = require('../util.js');

module.exports = function(req, res) {
    util.getCensusData({
        get: 'P0120002,P012A026',
        for: 'zip code tabulation area',
        in: 'state:51'
    }, res).then(function(data) {
        data = JSON.parse(data);
        
        var valueMap = {
            zipCode: data[0].indexOf('zip code tabulation area'),
            state: data[0].indexOf('state'),
            malePopulation: data[0].indexOf('P0120002'),
            femalePopulation: data[0].indexOf('P012A026')
        };

        // Remove the header data.
        data.splice(0, 1);
        
        let cleanData = _.reduce(data, function(memo, element) {
            memo[element[valueMap.zipCode]] = {
                'population': {
                    'male': element[valueMap.malePopulation],
                    'female': element[valueMap.femalePopulation]
                }
            };
            return memo;
        }, {});
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(cleanData));
    });
};