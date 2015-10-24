"use strict";

var querystring = require('querystring');
var request = require('request');
var _ = require('underscore');
var util = require('../util.js');

const CENSUS_API_TOKEN = '900de9519a11ff7d00d9deff7e9975e34d173a11';
const ZIP_CODE_API_TOKEN = 'VIL57psM9eRp7qzkc6N9oKKztPoHFP5AxRFEh7rqmjPtKpOWvB6UmQtPFSwlHCVf';

function scoreOnRange(min, max, value)
{
    if (value == null || min <= value && max >= value) {
        return 1;
    } else if (value < min) {
        console.log('0');
        return 0;//1 - ((min - value) / 1000);
    } else if (value > max) {
        console.log('0');
        return 0;// 1 - ((min - value) / 1000);
    }
}

module.exports = function(req, res) {
    var valueMap = {};

    util.getCensusData({
        get: 'P0120002,P012A026',
        for: 'zip code tabulation area',
        in: 'state:51'
    }, res).then(function(data) {
        data = JSON.parse(data);
        
        valueMap = {
            zipCode: data[0].indexOf('zip code tabulation area'),
            state: data[0].indexOf('state'),
            malePopulation: data[0].indexOf('P0120002'),
            femalePopulation: data[0].indexOf('P012A026')
        };

        // Remove the header data.
        data.splice(0, 1);
        
        return data;
    }).then(function(zipDemographics) {
        util.getAllZipCoordinates().then(function(zipCoordinates) {
            let zipScores = _.reduce(zipDemographics, function(memo, element) {
                let zipCode = element[valueMap.zipCode];
                let score = 1.0;
                // Modify score based on population.
                if (req.query.malePopMin && req.query.malePopMax) {
                    score *= scoreOnRange(req.query.malePopMin, req.query.malePopMax, element[valueMap.malePopulation]);
                }
                memo[zipCode] = {
                    score: score,
                    lat: zipCoordinates[zipCode].lat,
                    lng: zipCoordinates[zipCode].lng
                };
                return memo;
            }, {});

            res.send(JSON.stringify(zipScores));
        });
    });
};
