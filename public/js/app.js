/**
 * School of Santhi India
 * Trivandrum
 * Author : Shanmuga Priya Dhandapani
 */
var app1 = angular.module("sosMain", ["ngRoute", 'ngAnimate', 'ngSanitize', 'ui.calendar', 'ui.bootstrap', 'ngMap']);
var app2 = angular.module("maps", ["ngMap", "ngSanitize"]);
//var app = angular.module("sos",["sosMain","maps"]);
app1.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/home", {
            templateUrl: "home.html",
            controller: 'homeController'
        })
        .when("/program/classes", {
            templateUrl: "views/classes.html"
        })
        .when("/knowyoga", {
            templateUrl: "views/yoga-blog.html",
            controller: 'yogaBlogHomeController'
        })
        .when("/santhispeaks", {
            templateUrl: "views/shanthi-blog.html",
            controller: 'shanthiBlogController'
        })
        .when("/inthemedia", {
            templateUrl: "views/wait.html"
        })
        .when("/about", {
            templateUrl: "views/about.html",
            controller: "aboutController"
        })
        .when("/event/:eventId", {
            templateUrl: "views/event.html",
            controller: "eventController"

        })
        .when("/yoga/:id", {
            templateUrl: "views/yoga-blog.html",
            controller: "yogaController"

        })
        .when("/program/TTC", {
            templateUrl: "views/program.html",
            controller: "ttcController"
        })
        .when("/program/satsangs", {
            templateUrl: "views/satsang.html",
            controller: "satsangController"
        })
        .when("/contactus", {
            templateUrl: "views/contact.html",
            controller: "contactController"
        })
        .when("/gallery", {
            templateUrl: "views/gallery.html",
            controller: "galleryController"
        })
        .when("/create/new-event", {
            templateUrl: "views/create-event.html",
            controller: "eventController"
        })
        .when("/events", {
            templateUrl: "views/events.html"
        })
        .when("/program/workshops", {
            templateUrl: "views/workshops.html",
            controller: "workshopsController"
        })
        .when("/create/yoga", {
            templateUrl: "views/create-yoga-blog.html",
            controller: "yogaBlogController"
        })
        .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginController"
        })
        .otherwise({
            templateUrl: "home.html",
            controller: 'homeController'
        });
}).filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

app1.directive('fileModel', ['$parse', function($parse) {
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
app1.directive('btnCollapse', [function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                $(attrs.target).collapse('toggle');
            });
        }
    };
}]);
app1.directive('gallery', ["$uibModal", function($uibModal) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                scope.$apply(function() {

                    //$uibModal.open({
                    //    ariaLabelledBy: 'modal-title-top',
                    //    ariaDescribedBy: 'modal-body-top',
                    //    templateUrl: 'views/gallery1.html',
                    //   size: 'lg',
                    //    controller: function($scope, $http) {
                    //      $http.get("/api/gallery")
                    //           .then(function(response, err) {
                    //               var images = [];
                    //               _.each(response.data, function(src, i) {
                    //                   images.push({
                    //                       source: "../Content/img/gallery/" + src,
                    //                      id: i
                    //                  });
                    //             });
                    //             $scope.slides = images;
                    //         });
                    var win = window.open("https://goo.gl/photos/jkjYwhaUMcHcPjyV6", '_blank');
                    win.focus();

                    // }
                    //});
                });
            });
        }
    };
}]);

app1.service('eventsService', function($http) {
    var _this = this;
    this.getAllEvents = function() {
        $http.get("/api/event/getAll")
            .then(function(response, err) {
                if (err)
                    return;
                angular.forEach(response.data, function(event) {
                    event.startYear = event.startDate.split('/')[2].slice(2);
                    event.startMonth = event.startDate.split('/')[1];
                    event.startDay = event.startDate.split('/')[0];
                    event.endYear = event.endDate.split('/')[2].slice(2);
                    event.endMonth = event.endDate.split('/')[1];
                    event.endDay = event.endDate.split('/')[0];
                    event.slicedName = event.name.slice(0, 39);
                    event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
                });
                this.events = response.data.sort(function(a, b) {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
            })
    };
    this.setEvents = function(events) {
        this.events = events;
    };
});
app1.controller('eventsController', function($scope, $rootScope, eventsService, uiCalendarConfig, $location, $http, $timeout) {
    var events = [];
    $scope.cal = {};
    $scope.events = {};
    $scope.cal = {};
    if (eventsService.events) {
        _.each(eventsService.events, function(eve) {
            var url = $location.$$absUrl.slice(0, $location.$$absUrl.length - 1) + '/' + eve.id;
            events.push({
                title: eve.name,
                start: new Date(eve.startDate),
                end: new Date(eve.endDate),
                url: url,
                allDay: true
            });
        });
        var date = new Date();


        $scope.events = events;
        $scope.cal.eventSources = [{
            events: $scope.events
        }];
        $scope.uiConfig = {
            calendar: {
                height: 500,
            }
        };
    } else {


        $scope.cal.eventSources = [];
        $http.get("/api/event/getAll")
            .then(function(response, err) {
                if (err)
                    return;
                _.each(response.data, function(eve) {
                    var url = $location.$$absUrl.slice(0, $location.$$absUrl.length - 1) + '/' + eve.id;
                    events.push({
                        title: eve.name,
                        start: new Date(eve.startDate),
                        end: new Date(eve.endDate),
                        url: url,
                        allDay: true
                    });
                });

                $scope.events = events;

                $scope.cal.eventSources = [{
                    events: $scope.events
                }];
            })
        $scope.uiConfig = {
            calendar: {
                height: 500,
            }
        };

    }
})

app1.controller('loginController', ['$scope', '$http', function($scope, $http) {
    $scope.submitLogin = function() {
        $scope.invalidUser = false;
        if (!$scope.userEmail || !$scope.userPswd) {
            return;
        }
        var data = {
            email: $scope.userEmail,
            pswd: $scope.userPswd
        }
        $http.post("/api/login", data).then(function(response) {
            if (response) {
                location.href = './settings';
            }
        }, function() {
            $scope.invalidUser = true;
        });
    };
}]);

app1.controller('shanthiBlogController', function($scope, $location, $http, eventsService, $timeout) {
    $scope.shanthi = {};
    $scope.shanthi.blogs = [];
    $scope.shanthi.banner = "../bin/assets/banner.png";

    $scope.getAllShanthiBlogs = function() {
        $http.get('/api/santhiblog/getAllBlogs').then(function(res) {
            $scope.shanthi.blogs = res.data;
        });
    }
    $scope.getAllShanthiBlogs();
    $scope.showSelectedShanthiBlog = function (shanthiblog) {
        $scope.shanthiTitle = shanthiblog.title;
        $scope.shanthiDescription = shanthiblog.description;
    }
    $scope.closeShanthiModal = function () {
        $('#detailedShanthiModal').modal('hide');
    }
    $scope.prevent = function (event) {
        event.preventDefault();
    }
});

app1.controller('yogaBlogHomeController', function($scope, $location, $http, eventsService, $timeout) {
    $scope.yoga = {};
    $scope.yoga.blogs = [];
    $scope.yoga.banner = "../bin/assets/banner.png";

    $scope.getAllYogaBlogs = function() {
        $http.get('api/blog/getAllBlogs').then(function(res) {
            $scope.yoga.blogs = res.data;
        });
    }
    $scope.getAllYogaBlogs();
    $scope.showSelectedYogaBlog = function (yogablog) {
        $scope.yogaTitle = yogablog.title;
        $scope.yogaDescription = yogablog.description;
    }
    $scope.closeYogaModal = function () {
        $('#detailedYogaModal').modal('hide');
    }
    $scope.prevent = function (event) {
        event.preventDefault();
    }
});

app1.controller('homeController', function($scope, $location, $http, eventsService, $timeout) {
    //$scope.toggleLink = true;    
    $scope.toggle = function() {
        $('.tab-disappear').toggle('slow', function() {
            if ($(this).children().hasClass("hide")) {
                $(this).children().removeClass('hide');
                $(this).children().addClass('unhide');
            } else {
                $(this).children().removeClass('unhide');
                $(this).children().addClass('hide');

            }
        });
    };
    
    $scope.length = $('.thumbnail[render]').children().find('iframe').length;
    $scope.fbRendered = function() {};
    $scope.goHome = function() {
        $location.path('');
        // window.location.reload();
    };
    $scope.goToUrl = function(url) {
        var win = window.open(url, '_blank');
        win.focus();
    };
    $scope.goToProgram = function(programName) {
        var loc = '/program/' + programName;
        $location.path(loc);
        //window.location.reload();
    }
    $scope.goToEvent = function(eventObj) {
        var loc = '/event/' + eventObj.id;
        $location.path(loc);
        window.location.reload();
    };
    var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var events = $http.get("/api/event/getAll")
        .then(function(response, err) {
            if (err)
                return;
            console.log(response)
            angular.forEach(response.data, function(event) {
                event.startYear = event.startDate.split('/')[2].slice(2);
                event.startMonth = event.startDate.split('/')[1];
                event.startDay = event.startDate.split('/')[0];
                event.slicedName = event.name.slice(0, 39);
                event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
            });
            var events = response.data.sort(function(a, b) {
                return new Date(a.startDate) - new Date(b.startDate);
            });
            eventsService.setEvents(events);
            $scope.events = _.filter(events, function(obj, i) {
                return new Date(obj.startDate) >= new Date();
            });
            $scope.events = _.filter($scope.events, function(obj, i) {
                return i <= 3;
            });
        })

    getAllNews();
    $scope.newsItems = [];
    function getAllNews() {
        $http.get('/api/news/getAll').then(function(res) {
            //$scope.newsDataSet = [];
            console.log(res);
            $scope.newsItems = res.data;
        });
    }

    $scope.showSelectedNews = function (news) {
        $scope.newsTitle = news.title;
        $scope.newsDescription = news.description;
    }    

    $scope.closeNewsModal = function () {
        $('#detailedNewsModal').modal('hide');
    }

});
app1.controller('aboutController', ['$scope', function($scope) {
    $scope.goToUrl = function(url) {
        var win = window.open(url, '_blank');
        win.focus();
    };
    $scope.nav = "SOS";
}]);
app1.controller('galleryController', function($scope, $http, $uibModal) {
    var $ctrl = this;
    $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-top',
        ariaDescribedBy: 'modal-body-top',
        templateUrl: 'views/gallery1.html',
        size: 'lg',
        controller: function($scope, $http) {
            $http.get("/api/gallery")
                .then(function(response, err) {
                    var images = [];
                    _.each(response.data, function(src, i) {
                        images.push({
                            source: "../Content/img/gallery/" + src,
                            id: i
                        });
                    });
                    $scope.slides = images;
                });

        }
    });
});
app1.controller('satsangController', function($scope, $http, eventsService) {
    if (eventsService.events) {
        $scope.filteredEvents = _.filter(eventsService.events, function(obj, i) {
            return obj.type == "Satsang" && new Date(obj.startDate) >= new Date();
        });
        $scope.filteredEvents = _.filter($scope.filteredEvents, function(obj, i) {
            return i <= 3;
        });
    } else {
        $http.get("/api/event/getAll")
            .then(function(response, err) {
                if (err)
                    return;
                angular.forEach(response.data, function(event) {
                    event.startYear = event.startDate.split('/')[2].slice(2);
                    event.startMonth = event.startDate.split('/')[1];
                    event.startDay = event.startDate.split('/')[0];
                    event.endYear = event.endDate.split('/')[2].slice(2);
                    event.endMonth = event.endDate.split('/')[1];
                    event.endDay = event.endDate.split('/')[0];
                    event.slicedName = event.name.slice(0, 39);
                    event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
                });
                $scope.events = response.data.sort(function(a, b) {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
                $scope.filteredEvents = _.filter($scope.events, function(obj, i) {
                    return obj.type == "Satsang" && new Date(obj.startDate) >= new Date();
                });
                $scope.filteredEvents = _.filter($scope.filteredEvents, function(obj, i) {
                    return i <= 3;
                });
            })
    }
});
app1.controller('knowYogaController', function($scope, $http, eventsService) {
    if (eventsService.events) {
        $scope.filteredEvents = _.filter(eventsService.events, function(obj, i) {
            return i <= 4;
        });
    } else {
        $http.get("/api/event/getAll")
            .then(function(response, err) {
                if (err)
                    return;
                angular.forEach(response.data, function(event) {
                    event.startYear = event.startDate.split('/')[2].slice(2);
                    event.startMonth = event.startDate.split('/')[1];
                    event.startDay = event.startDate.split('/')[0];
                    event.endYear = event.endDate.split('/')[2].slice(2);
                    event.endMonth = event.endDate.split('/')[1];
                    event.endDay = event.endDate.split('/')[0];
                    event.slicedName = event.name.slice(0, 39);
                    event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
                });
                $scope.events = response.data.sort(function(a, b) {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
                $scope.filteredEvents = _.filter($scope.events, function(obj, i) {
                    return new Date(obj.startDate) >= new Date();
                });
                $scope.filteredEvents = _.filter($scope.events, function(obj, i) {
                    return i <= 4;
                });
            })
    }
    $http.get("/api/yoga/getAllBlogs")
        .then(function(response, err) {
            if (err)
                return;
            angular.forEach(response.data, function(blog) {
                blog.slicedContent = $($(blog.content)[0]).text().slice(0, 400);
            });
            $scope.blogs = response.data;
        });
});
app1.controller('workshopsController', function($scope, $http, eventsService) {
    if (eventsService.events) {
        $scope.workshopEvents = _.filter(eventsService.events, function(obj, i) {
            return obj.type == "Workshops" && new Date(obj.startDate) >= new Date();
        });
        $scope.workshopEvents = _.filter($scope.workshopEvents, function(obj, i) {
            return i <= 3;
        });
        $scope.retreatEvents = _.filter(eventsService.events, function(obj, i) {
            return obj.type == "Retreats" && new Date(obj.startDate) >= new Date();
        });
        $scope.retreatEvents = _.filter($scope.retreatEvents, function(obj, i) {
            return i <= 4;
        });
    } else {
        $http.get("/api/event/getAll")
            .then(function(response, err) {
                if (err)
                    return;
                angular.forEach(response.data, function(event) {
                    event.startYear = event.startDate.split('/')[2].slice(2);
                    event.startMonth = event.startDate.split('/')[1];
                    event.startDay = event.startDate.split('/')[0];
                    event.endYear = event.endDate.split('/')[2].slice(2);
                    event.endMonth = event.endDate.split('/')[1];
                    event.endDay = event.endDate.split('/')[0];
                    event.slicedName = event.name.slice(0, 39);
                    event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
                });
                $scope.events = response.data.sort(function(a, b) {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
                $scope.workshopEvents = _.filter($scope.events, function(obj, i) {
                    return obj.type == "Workshops" && new Date(obj.startDate) >= new Date();
                });
                $scope.workshopEvents = _.filter($scope.workshopEvents, function(obj, i) {
                    return i <= 3;
                });
                $scope.retreatEvents = _.filter($scope.events, function(obj, i) {
                    return obj.type == "Retreats" && new Date(obj.startDate) >= new Date();
                });
                $scope.retreatEvents = _.filter($scope.retreatEvents, function(obj, i) {
                    return i <= 4;
                });
            })
    }
});
app1.controller('ttcController', function($scope, $routeParams, eventsService, $http) {
    $scope.goToUrl = function(url) {
        var win = window.open(url, '_blank');
        win.focus();
    };
    if (eventsService.events) {
        $scope.filteredEvents = _.filter(eventsService.events, function(obj, i) {
            return obj.type == "TTC" && new Date(obj.startDate) >= new Date();
        });
        $scope.filteredEvents = _.filter($scope.filteredEvents, function(obj, i) {
            return i <= 4;
        });
    } else {
        $http.get("/api/event/getAll")
            .then(function(response, err) {
                if (err)
                    return;
                angular.forEach(response.data, function(event) {
                    event.startYear = event.startDate.split('/')[2].slice(2);
                    event.startMonth = event.startDate.split('/')[1];
                    event.startDay = event.startDate.split('/')[0];
                    event.endYear = event.endDate.split('/')[2].slice(2);
                    event.endMonth = event.endDate.split('/')[1];
                    event.endDay = event.endDate.split('/')[0];
                    event.slicedName = event.name.slice(0, 39);
                    event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
                });
                $scope.events = response.data.sort(function(a, b) {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
                $scope.filteredEvents = _.filter($scope.events, function(obj, i) {
                    return obj.type == "TTC" && new Date(obj.startDate) >= new Date();
                });
                $scope.filteredEvents = _.filter($scope.filteredEvents, function(obj, i) {
                    return i <= 4;
                });
            })
    }
    $scope.toggleCaretIcon = function(e) {
        if ($(e.currentTarget).children().hasClass('fa-angle-double-down')) {
            $(e.currentTarget).children().removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
        } else {
            $(e.currentTarget).children().addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
        }
    };
    $scope.toggleCaret = function(e) {
        if ($(e.currentTarget).hasClass('fa-angle-double-down')) {
            $(e.currentTarget).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
        } else {
            $(e.currentTarget).addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
        }
    };
});
app1.controller('ModalInstanceCtrl', function($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
app1.controller('contactController', function($scope, $http) {
    $scope.loadedInIndia = false;
     $http.get("http://ip-api.com/json").then(function(response){
        var locationDetails = response.data;
        if(locationDetails.country.toLowerCase() == "india" && locationDetails.countryCode.toLowerCase() == "in"){
            $scope.loadedInIndia = true;
        }
        else {
            $scope.loadedInIndia = false;
        }    
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDC3m9iYece09zWTYbxV9J8tiGWA7d0CCk";    
    })        
});
app1.controller('yogaBlogController', function($scope, $http, $location) {
    $scope.blog = {};
    $(document).ready(function() {
        $('#summernote').summernote();
    });
    $scope.goToblog = function(id) {
        $location.path('/yoga/' + id);
    }
    $scope.saveYogaBlog = function(blog) {
        blog.content = $('#summernote').summernote('code');
        $http.post("/api/yogablog/save", blog).then(function(response) {
            $scope.successAlert = response.data;
        });
    };
});
app1.controller('blogController', function($scope, $http, $location) {
    $scope.blog = {};
    $(document).ready(function() {
        $('#summernote').summernote();
    });
    $scope.goToblog = function(id) {
        $location.path('/blog/' + id);
    }
    $scope.saveYogaBlog = function(blog) {
        blog.dateCreated = new Date();
        blog.content = $('#summernote').summernote('code');
        $http.post("/api/blog/save", blog).then(function(response) {
            $scope.successAlert = response.data;
        });
    };
});
app1.controller('yogaController', function($scope, $http, $routeParams) {
    $http.get("/api/yoga/getblog/" + $routeParams.id).then(function(response, err) {
        if (err)
            return;
        $scope.blog = response.data;
        angular.element(document.querySelector('#content')).append($scope.blog.content);
    });
});
app2.controller('eventController', function($scope, $routeParams, $http, eventsService, $uibModal) {
    $scope.goToUrl = function(venue) {
        var win = window.open(venue, '_blank');
        win.focus();
    };
    $(document).ready(function() {
        $('.selectpicker').selectpicker();

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
    if ($routeParams.eventId) {
        $(document).ready(function() {
            var url = document.URL;
            $('.fb-share-button').attr('data-href', url);
        });
        $scope.submitForm = function() {
            var $ctrl = this;
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'views/submitForm.html',
                scope: $scope,
                controller: function($scope, $uibModalInstance) {
                    $scope.show = false;
                    if ($scope.$parent.event.type == "TTC") {
                        $scope.show = true
                    };
                    $scope.openModal = function(id) {
                        var $ctrl = this;
                        $uibModal.open({
                            animation: true,
                            ariaLabelledBy: 'modal-title-top',
                            ariaDescribedBy: 'modal-body-top',
                            templateUrl: 'views/' + id + '.html',
                            size: 'lg',
                            controller: function($scope, $uibModalInstance) {
                                // $scope.name = 'top';
                                $(document).ready(function() {
                                    $('#' + id).parentsUntil('modal').filter('.modal').css("z-index", 1060)
                                });

                                $scope.cancel = function() {
                                    $uibModalInstance.dismiss('cancel');
                                };

                                //  $uibModalInstance.dismiss('cancel');

                            }
                        });
                    };
                    $scope.applicant = {};
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.submit = function() {
                        $scope.$parent.applicant = $scope.applicant;
                        $scope.$parent.submit();
                    }
                }
            });
        }

        $http.get("/api/event/getEvent/" + $routeParams.eventId).then(function(response, err) {
            if (err)
                return;
            var event = response.data;
            event.startYear = event.startDate.split('/')[2].slice(2);
            event.startMonth = event.startDate.split('/')[1];
            event.startDay = event.startDate.split('/')[0];
            event.regClosesYear = event.regClosesOn.split('/')[2];
            event.regClosesMonth = event.regClosesOn.split('/')[1];
            event.regClosesDay = event.regClosesOn.split('/')[0];
            event.endYear = event.endDate.split('/')[2].slice(2);
            event.endMonth = event.endDate.split('/')[1];
            event.endDay = event.endDate.split('/')[0];
            event.slicedName = event.name.slice(0, 39);
            event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
            if (event.video && event.video.includes("youtube")) {
                var param = event.video.split("?v=")[1];
                $('.embed-responsive').append('<iframe class="embed-responsive-item" src="' + "http://www.youtube.com/embed/" + param + '" allowfullscreen event-video></iframe>');
            }
            $scope.event = event;
            $('meta[property="og:description"]').attr('content', event.slicedDesc)
            //$('head').append('<meta property="og:description" content="'+ 'hi' +'" />');
            //$('head').append('<meta property="og:image" content="http://139.59.11.105:8080/'+ event.imageSrc +'" />');
            angular.element(document.querySelector('#description')).append($scope.event.description);
            var endDate = $scope.event.endDate.split('/');
            $scope.event.duration = $scope.event.startDay + " " + $scope.event.startMonth + " - " + endDate[0] + " " + endDate[1] + " " + endDate[2];

            if (eventsService.events) {
                $scope.filteredEvents = _.filter(eventsService.events, function(obj, i) {
                    return (new Date(obj.endDate) > new Date()) && obj.id != $scope.event.id && i <= 4;
                });
            } else {
                $http.get("/api/event/getAll")
                    .then(function(response, err) {
                        if (err)
                            return;
                        angular.forEach(response.data, function(event) {
                            event.startYear = event.startDate.split('/')[2].slice(2);
                            event.startMonth = event.startDate.split('/')[1];
                            event.startDay = event.startDate.split('/')[0];
                            event.endYear = event.endDate.split('/')[2].slice(2);
                            event.endMonth = event.endDate.split('/')[1];
                            event.endDay = event.endDate.split('/')[0];
                            event.slicedName = event.name.slice(0, 39);
                            event.slicedDesc = $($(event.description)[0]).text().slice(0, 70);
                        });
                        var events = response.data.sort(function(a, b) {
                            return new Date(a.startDate) - new Date(b.startDate);
                        });
                        $scope.filteredEvents = _.filter(events, function(obj, i) {
                            return (new Date(obj.endDate) > new Date()) && obj.id != $scope.event.id && i <= 4;
                        });
                    })
            }
        });

        $scope.toggleCaretIcon = function(e) {
            if ($(e.currentTarget).children().hasClass('fa-angle-double-down')) {
                $(e.currentTarget).children().removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
            } else {
                $(e.currentTarget).children().addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
            }
        };
        $scope.toggleCaret = function(e) {
            if ($(e.currentTarget).hasClass('fa-angle-double-down')) {
                $(e.currentTarget).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
            } else {
                $(e.currentTarget).addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
            }
        };
        $scope.map = {
            center: {
                latitude: 8.708693,
                longitude: 77.131483
            },
            zoom: 3
        };
        $scope.submit = function() {
            var data = {
                applicant: $scope.applicant,
                event: $scope.event
            };
            $http.post("/api/submit", data).then(function(response) {
                $scope.successAlert = response.data;
            });
        }

    } else {
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
        $scope.save = function(eve) {
            eve.startDate = $('#datetimepicker1').data("DateTimePicker").date().format("DD/MMM/YYYY");
            eve.endDate = $('#datetimepicker2').data("DateTimePicker").date().format("DD/MMM/YYYY");
            eve.regClosesOn = $('#datetimepicker3').data("DateTimePicker").date().format("DD/MMM/YYYY");
            eve.description = $('#summernote').summernote('code');

            $http.post("/api/event/save", eve).then(function(response) {
                $scope.successAlert = response.data;
                $scope.event = {
                    type: "TTC"
                };
                $('#summernote').summernote('reset');
            });

        };
    };

});

angular.module("sos", ["sosMain", "maps"]);