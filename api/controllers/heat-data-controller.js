"use strict";

var querystring = require('querystring');
var request = require('request');
var _ = require('underscore');
var util = require('../util.js');

const CENSUS_API_TOKEN = '900de9519a11ff7d00d9deff7e9975e34d173a11';
const ZIP_CODE_API_TOKEN = 'VIL57psM9eRp7qzkc6N9oKKztPoHFP5AxRFEh7rqmjPtKpOWvB6UmQtPFSwlHCVf';

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
        
        var centralZip = req.query.centralZip;
        var populationMin = req.query.populationMin;
        
        let perZipData = _.reduce(data, function(memo, element) {
            memo[element[valueMap.zipCode]] = Math.random();
            
            // Scoring here.
            return memo;
        }, {});

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(perZipData));
    });
};