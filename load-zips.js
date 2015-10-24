// This script is designed specifically for loading ZIP code coordinate data from
// the US Census dataset into MongoDB. The data file must be called zipdata.txt, and
// it must be retrieved from the following URL: http://www2.census.gov/geo/docs/maps-data/data/gazetteer/2015_Gazetteer/2015_Gaz_zcta_national.zip
// Finally, the header at the top of the text file must be removed.

"use strict";
var fs = require('fs');
var mongo = require('mongodb');

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
    mongo.MongoClient.connect(monogUrl, function(err, db) {
      console.log("Connected correctly to server");
      let collection = db.collection('zipCoordinates');
      collection.insertMany(zipCoordinates, function(err, result) {
        if (err !== null) {
            console.log(err);
        }
        db.close();
      });
    });
});
