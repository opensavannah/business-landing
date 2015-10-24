var API_URL = 'http://localhost:3001/api'

var app = angular.module('business-landing', ['ngRoute']);

app.controller('MapController', ['$scope', '$http', function($scope, $http) {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 36.9167, lng: -76.2000},
      zoom: 8
    });
    
    $http.get(API_URL + '/heat-data?malePopMin=20&malePopMax=30').then(function(response) {
        var data = [];
        for (var zipCode in response.data) {
            // The higher the score, the more points we place in that spot. We do this
            // in order to make spots with higher favorability hotter on the map.
            var score = response.data[zipCode].score;
            console.log(score);
            for (var i = 0; i < 20 * score; i++) {
                var lat = parseFloat(response.data[zipCode].lat);
                var lng = parseFloat(response.data[zipCode].lng);
                lat += Math.random() / 1000;
                lng += Math.random() / 1000;
                data.push(new google.maps.LatLng(lat, lng));
            }
        }
        initializeHeatMap($http, map, data); 
    });
}]);

app.controller('DemographicsSelectionController', ['$scope', '$http', function($scope, $http) {
}]);


function initializeHeatMap($http, googleMap, data)
{
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: data,
        map: googleMap
    });
    
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'

    ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}