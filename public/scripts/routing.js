var app = angular.module('business-landing', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/greeting.html',
    }).when('/business-choice', {
        templateUrl: 'templates/business-choice.html',
    });      
}]);