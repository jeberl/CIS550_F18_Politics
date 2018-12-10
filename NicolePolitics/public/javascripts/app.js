var app = angular.module('angularjsNodejsTutorial',[]);

// Controller for "Closest Committee Race" on Committee Page
app.controller('closestCommitteeController', function($scope, $http) {
    $scope.message="";
    $scope.GetClosestRace = function() {
        var request = $http.post('/closestCommitteeData/'+$scope.comcode+'/'+$scope.subcomcode);
        request.success(function(data) {
            $scope.Cdata = data;
            console.log($scope.Cdata);
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
            $scope.Ldata = data;
            console.log($scope.Ldata);
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
            $scope.Adata = data;
            console.log(data);
            console.log('got');
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
            $scope.rundata = data;
            console.log($scope.rundata);
        });
        request.error(function(data){
            console.log('err');
        });
    
    };
});

