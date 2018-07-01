// create a module and set it to app variable.

var app = angular.module('userApp' , ['ngRoute','authServices','mainController', 'userController','userServices' ])
//angular.module('userApp', ['ngRoute','appRoutes','userController', 'userServices', 'ngAnimate', 'mainController']);


.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});