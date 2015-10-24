"use strict";

var querystring = require('querystring');
var request = require('request');
var mongodb = require('mongodb');
var _ = require('underscore');

const CENSUS_API_TOKEN = '900de9519a11ff7d00d9deff7e9975e34d173a11';
const ZIP_CODE_API_TOKEN = 'VIL57psM9eRp7qzkc6N9oKKztPoHFP5AxRFEh7rqmjPtKpOWvB6UmQtPFSwlHCVf';
const MONGODB_URL = 'mongodb://localhost:27017/businesslanding';

module.exports = {
    /**
     * Gets data from the US census API and returns a promise.
     * @returns A promise that is resolved with the body of the response.
     */
    getCensusData: function(params, expressResponse) {
        let apiUrl = 'http://api.census.gov/data/2010/sf1?key=900de9519a11ff7d00d9deff7e9975e34d173a11&';
        apiUrl += querystring.stringify(params);

        let dataPromise = new Promise(function(resolve, reject) {
            request(apiUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
            });
        });

        return dataPromise;                
    },
    /**
     * Get zip codes in a certain radius.
     */
    getZipCodesInRadius: function(zipCode, radius) {
        let apiUrl = 'https://www.zipcodeapi.com/rest/' + ZIP_CODE_API_TOKEN + '/radius.json/' + zipCode + '/' + radius + '/mile';
        let dataPromise = new Promise(function(resolve, reject) {
            request(apiUrl, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
            });
        });

        return dataPromise;
    },
    /**
     * Return a list of coordinates for every US zip code.
     */
    getAllZipCoordinates: function() {
        let dataPromise = new Promise(function(resolve, reject) {
            mongodb.MongoClient.connect(MONGODB_URL, function(err, db) {
                let collection = db.collection('zipCoordinates');
                collection.find({}).toArray(function(err, docs) {
                    db.close();
                    
                    let zipCoords = _.reduce(docs, function(memo, doc) {
                        memo[doc.zip] = {
                            lat: doc.lat,
                            lng: doc.lng
                        };
                        return memo;
                    }, {});
                    
                    resolve(zipCoords);
                });      
            });
        });
        
        return dataPromise;
    },
    
};