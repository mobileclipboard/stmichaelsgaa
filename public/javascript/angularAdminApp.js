var angularAdminApp = angular.module('membershipApp', ['ui.router', 'ui.bootstrap']);


angularAdminApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'template/admin.html',
			controller: 'adminCtrl',
			resolve: {
				postPromise: ['api', function(api) {
					return api.getAll();
				}]
			}

		});
	$urlRouterProvider.otherwise('home');
}]);

angularAdminApp.factory('api', ['$http', function($http){
	var api_data = {
		users: [],
		news: [],
		dates: []
	};

	api_data.getAll = function(){
		$http.get('/userapi').success(function(data){
			angular.copy(data, api_data.users);
		});
		$http.get('/newsapi').success(function(data){
			angular.copy(data, api_data.news);
		});
		$http.get('/diaryapi').success(function(data){
			angular.copy(data, api_data.dates);
		});
	};

	return api_data;


}]);

angularAdminApp.controller('adminCtrl', ['$scope', 'api', function($scope, api){
	$scope.users = api.users;
	$scope.news = api.news;
	$scope.dates = api.dates;

	$scope.edit_article = function(article){
		$scope.currentArticle =  article;
		$('#editArticle').modal('show');
	};

	$scope.view_article = function(article){
		$scope.currentArticle =  article;
		$('#viewArticle').modal('show');
	};

	$scope.view_date = function(date){
		$scope.currentDate =  date;
		$('#viewDate').modal('show');
	};

	$scope.edit_date = function(date){
		$scope.currentDate =  date;
		$scope.mystarttime = new Date(date.diary_startdate);
		$scope.myendtime = new Date(date.diary_enddate);
		$('#editDate').modal('show');
	};

	// Code for datepicker
	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.mystarttime = new Date();
	$scope.mystarttime.setHours(12);
	$scope.mystarttime.setMinutes(0);

	$scope.myendtime = new Date();
	$scope.myendtime.setHours(12);
	$scope.myendtime.setMinutes(0);

	$scope.hstep = 1;
	$scope.mstep = 15;

	$scope.ismeridian = false;

	//END Code for datepicker

}]);