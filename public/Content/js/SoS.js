var SoS = angular.module('SoS', ["ngRoute"]);
SoS.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html"
    })
    .when("/about", {
        templateUrl : "about/about.html"
    })
});
SoS.controller('MainController', ['$scope', function($scope) {
    $scope.template = "home.html"
}]);