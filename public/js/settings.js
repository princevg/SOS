var sosSettings = angular.module("sosSettings", ["ngRoute", 'ngAnimate', 'ngSanitize']);
sosSettings.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/edit/event/:id", {
            templateUrl: "/views/create-event.html",
            controller: "eventController"
        })
        .otherwise({
            templateUrl: "/views/settings.html",
            controller: "settingsController"
        });
});

sosSettings.controller('settingsController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.news = {};
    $scope.newsDataSet = [];
    $scope.logout = function() {
        $http.get('/api/logout').then(function() {
            location.href = '../#/login';
        })
    }

    $scope.saveNews = function() {

        if (!$scope.news.title || !$scope.news.description || !$scope.news.highlight) {
            return;
        }
        var data = {
            title: $scope.news.title,
            description: $scope.news.description,
            highlight: $scope.news.highlight
        }
        $http.post('/api/save/news', data).then(function(result) {
            console.log(result);
            $scope.news.title = '';
            $scope.news.description = '';
            $scope.news.highlight = '';
            getAllNews();
        })
    }
    getAllNews();

    function getAllNews() {
        $http.get('/api/news/getAll').then(function(res) {
            //$scope.newsDataSet = [];
            console.log(res);
            $scope.newsDataSet = res.data;
        });
    }

    $scope.blog = {};
    $scope.saveBlog = function(blog) {
        blog.date = (new Date()).getTime();
        blog.description = $('#blogDescription').summernote('code');
        $http.post("/api/blog/save", blog).then(function(response) {
            $scope.successAlert = response.data;
            $scope.blog = {};
            $('#blogDescription').summernote('code', '');
            angular.element("input[type='file']").val(null);
            $timeout(function() {
                $scope.$apply();
            });
        });
    };

    $scope.enableDescription = function() {
        $('#blogDescription').summernote({
            height: 150, //set editable area's height
        });
    }

}])
sosSettings.controller('eventsGridController', ['$scope', '$location', function($scope, $location) {
    $scope.editForm = function(id) {
        var loc = '/settings/#/edit/event/' + id;
        window.location.href = loc;
    };

}]);
sosSettings.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        modelSetter(scope, event.target.result);
                    };

                    reader.readAsDataURL(element[0].files[0]);
                });
            });
        }
    };
}]);
sosSettings.controller('eventController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $(document).ready(function() {
        $('.selectpicker').selectpicker();
        //$scope.event.type = $scope.event.type;
        $('#summernote').summernote();
        $('#datetimepicker1').datetimepicker({
            format: 'DD-MMM-YYYY'
        });
        $('#datetimepicker2').datetimepicker({
            format: 'DD-MMM-YYYY'
        });
        $('#datetimepicker3').datetimepicker({
            format: 'DD-MMM-YYYY'
        });
        $("#datetimepicker1").on("dp.change", function(e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker1").on("dp.change", function(e) {
            $('#datetimepicker3').data("DateTimePicker").maxDate(e.date);
        });

    });
    $scope.addRow = function() {
        $scope.event.schedule.push({
            starts: "",
            ends: "",
            schedule: ""
        });
    };
    $scope.deleteRow = function(item) {
        $scope.event.schedule = _.reject($scope.event.schedule, function(obj) {
            return obj == item;
        });
    };
    $scope.types = [{
        name: "TTC"
    }, {
        name: "Satsang"
    }, {
        name: "Workshops"
    }, {
        name: "Retreats"
    }];
    $scope.event = {
        type: "TTC",
        schedule: [{
            starts: "",
            ends: "",
            schedule: ""
        }]
    };
    $http.get("/api/event/getEvent/" + $routeParams.id).then(function(response, err) {
        if (err)
            return;
        $scope.types = [{
            name: "TTC"
        }, {
            name: "Satsang"
        }, {
            name: "Workshops"
        }, {
            name: "Retreats"
        }];
        $scope.event = response.data;
        $scope.selectedType = $scope.event.type;
        $('#summernote').summernote('insertNode', $($scope.event.description)[0]);
    });
    $scope.save = function(eve) {
        eve.startDate = $('#datetimepicker1').data("DateTimePicker").date().format("DD/MMM/YYYY");
        eve.endDate = $('#datetimepicker2').data("DateTimePicker").date().format("DD/MMM/YYYY");
        eve.regClosesOn = $('#datetimepicker3').data("DateTimePicker").date().format("DD/MMM/YYYY");
        eve.description = $('#summernote').summernote('code');

        $http.post("/api/edit/event", eve).then(function(response) {
            $scope.successAlert = response.data;
        });

    };


}]);