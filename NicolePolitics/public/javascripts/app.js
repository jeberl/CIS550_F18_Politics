var app = angular.module('angularjsNodejsTutorial',[]);

// Controller for the Committee Page
app.controller('CommitteeController', function($scope, $http) {
    $scope.message="";

    var request = $http.get('/committeeDropDown');
    request.success(function(data) {
        $scope.committeeDropDown = data;
        console.log($scope.committeeDropDown);
    });
    request.error(function(data){
        console.log('err');
    });

    $scope.populateSubDrop = function() {
        var request = $http.post('/SubCommitteeData/'+$scope.committeeDrop.committee_id);
        request.success(function(data) {
            $scope.subcommitteeDropDown = data;
            console.log($scope.subcommitteeDropDown);
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.GetClosestRace = function() {
        var request = $http.post('/closestCommitteeData/'+$scope.committeeDrop.committee_id+'/'+$scope.subcommitteeDrop.subcommittee);
        request.success(function(data) {
            $scope.Cdata = data;
            console.log($scope.Cdata);
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.GetLeastLikely = function() {
        var request = $http.post('/leastLikelyData/'+$scope.committeeDrop.committee_id+'/'+$scope.subcommitteeDrop.subcommittee);
        request.success(function(data) {
            $scope.Ldata = data;
            console.log($scope.Ldata);
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.GetAllMembers = function() {
        var request = $http.post('/allMemberOnComData/'+$scope.committeeDrop.committee_id+'/'+$scope.subcommitteeDrop.subcommittee);
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

