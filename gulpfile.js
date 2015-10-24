"use strict";
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mongodb = require('mongodb');
var fs = require('fs');

gulp.task('runSite', function() {
    nodemon({script: 'server.js'});
});

gulp.task('runApi', function() {
    nodemon({script: 'api/server.js', ext: 'js', watch: ['api']});    
});

gulp.task('loadZipData', function() {
    fs.readFile('zipdata.txt', function(err, data) {
        if (err) {
            throw err;
        }

        let dataString = data.toString();
        let lines = dataString.split(/\r?\n/);
        let zipCoordinates = [];
        lines.forEach((line) => {
            if (line.trim() != '') {
                let fields = line.split('\t');

                var coords = {
                    zip: fields[0].trim(),
                    lat: fields[5].trim(),
                    lng: fields[6].trim()
                };
                zipCoordinates.push(coords);
            }
        });
        // Connection URL
        let mongoUrl = 'mongodb://localhost:27017/businesslanding';
        // Use connect method to connect to the Server
        mongodb.MongoClient.connect(mongoUrl, function(err, db) {
            console.log("Connected correctly to server");
            let collection = db.collection('zipCoordinates');

            collection.deleteMany({}, function(err, results) {
                collection.insertMany(zipCoordinates, function(err, result) {
                    if (err !== null) {
                        console.log(err);
                    }
                    db.close();
                });
            });
        });
    });
});

