// avoid defining modules again and again instead store it in a variable. which is "app"
app.config(function($routeProvider , $locationProvider){

    $routeProvider
    .when('/',{
        templateUrl: 'app/views/pages/login-register.html',
        controller : "regCtrl",
        controllerAs : 'register'
    })
    

    .when('/group', {
        templateUrl: 'app/views/pages/group.html',
        controller : "mainCtrl"
    })

    .when('/home', {
        templateUrl: 'app/views/pages/newsfeed.html',
        controller : "mainCtrl"
    })

    .when('/class', {
        templateUrl: 'app/views/pages/class.html',
        controller : "mainCtrl"
    })



    .when('/About', {
        templateUrl: 'app/views/pages/timeline-about.html'
    })

    .when('/profilebasic', {
        templateUrl: 'app/views/pages/edit-profile-basic.html'
    })

    .when('/profileeduwork', {
        templateUrl: 'app/views/pages/edit-profile-work-edu.html'
    })

    .when('/profilechangepassword', {
        templateUrl: 'app/views/pages/edit-profile-password.html'
    })
    .when('/messages', {
        templateUrl: 'app/views/pages/newsfeed-messages.html'
    })

    .when('/logout', {
        templateUrl: 'app/views/pages/login-register.html'
    })
    .when('/login', {
        templateUrl: 'app/views/pages/login-register.html',
    })




    .otherwise({ redirectTo:'/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

});
