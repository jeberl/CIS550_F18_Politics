var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
    $scope.message="";
    $scope.Submit = function() {
        var request = $http.get('/data/'+$scope.email);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    };
});

// Controller for "Closest Committee Race" on Committee Page
app.controller('closestCommitteeController', function($scope, $http) {
    $scope.message="";
    $scope.GetClosestRace = function() {
        var request = $http.post('/closestCommitteeData/'+$scope.comcode+'/'+$scope.subcomcode);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };
});

// Controller for "Least Likely to be Re-elected" on Committee Page
app.controller('leastLikelyCommitteeController', function($scope, $http) {
    $scope.message="";
    $scope.GetLeastLikely = function() {
        var request = $http.post('/leastLikelyData/'+$scope.comcode+'/'+$scope.subcomcode);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };
});

// Controller for "Get All Committees" on Committee Page
app.controller('allMembersOnCommitteeController', function($scope, $http) {
    $scope.message="";
    $scope.GetAllMembers = function() {
        var request = $http.post('/allMemberOnComData/'+$scope.comcode+'/'+$scope.subcomcode);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };
});

// Controller for "Who's Running?" page
app.controller('runningController', function($scope, $http) {
    $scope.Running = function() {
        var request = $http.get('/runningData/'+$scope.state+'/'+$scope.district);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    };
});

// Controller for "Show Family" page
app.controller('showFamilyController', function($scope, $http) {
    $scope.message="";
    var request = $http.get('/familyDropDown');
    request.success(function(data) {
        $scope.familyDropDown = data;
    });
    request.error(function(data){
        console.log('err');
    });

    $scope.ShowFamily = function() {
        var request = $http.get('/familyData/'+$scope.familyLogin.login);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    };
})