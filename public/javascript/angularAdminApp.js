var angularAdminApp = angular.module('membershipApp', ['ui.router']);


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
		news: []
	};

	api_data.getAll = function(){
		$http.get('/userapi').success(function(data){
			angular.copy(data, api_data.users);
		});
		$http.get('/newsapi').success(function(data){
			angular.copy(data, api_data.news);
		});
	};

	return api_data;


}]);

angularAdminApp.controller('adminCtrl', ['$scope', 'api', function($scope, api){
	$scope.users = api.users;
	$scope.news = api.news;

	$scope.edit = function(article){
		$scope.currentArticle =  article;
		$('#editArticle').modal('show');
		console.log(article._id);
	};

	$scope.view = function(article){
		$scope.currentArticle =  article;
		$('#viewArticle').modal('show');
	};

}]);