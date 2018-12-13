var app = angular.module('angularjsNodejsTutorial',[]);

// Controller for the Committee Page
app.controller('CommitteeController', function($scope, $http) {
    $scope.message="";

    var request = $http.get('/committeeDropDown');
    request.success(function(data) {
        $scope.committeeDropDown = data;
    });
    request.error(function(data){
        console.log('err');
    });

    $scope.populateSubDrop = function() {
        var request = $http.post('/SubCommitteeData/'+$scope.committeeDrop.committee_id);
        request.success(function(data) {
            $scope.subcommitteeDropDown = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.GetClosestRace = function() {
        var pollModel = document.getElementById('pollModelDropDown').value;
        var request = $http.post('/closestCommitteeData/'+$scope.committeeDrop.committee_id+'/'+$scope.subcommitteeDrop.subcommittee_id+"/"+pollModel);
        request.success(function(data) {
            $scope.Cdata = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.GetLeastLikely = function() {
        var pollModel = document.getElementById('pollModelDropDown').value;
        var request = $http.post('/leastLikelyData/'+$scope.committeeDrop.committee_id+'/'+$scope.subcommitteeDrop.subcommittee_id+"/"+pollModel);
        request.success(function(data) {
            $scope.Ldata = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.GetAllMembers = function() {
        var request = $http.post('/allMemberOnComData/'+$scope.committeeDrop.committee_id+'/'+$scope.subcommitteeDrop.subcommittee_id);
        request.success(function(data) {
            $scope.Adata = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };
});

// Controller for "Who's Running?" page
app.controller('runningController', function($scope, $http) {
    var candidatesCache = {};

    var request = $http.get('/stateDropDown');
    request.success(function(data) {
        $scope.stateDropDown = data;
    });
    request.error(function(data){
        console.log('err');
    });

    $scope.PopulateDistrictDrop = function() {
        var request = $http.post('/districtData/'+$scope.stateDrop.state);
        request.success(function(data) {
            $scope.districtDropDown = data;
        });
        request.error(function(data){
            console.log('err');
        });
    };

    $scope.Running = function() {
        console.log("ran running");
        const state = $scope.stateDrop.state;
        const district = $scope.districtDrop.district;
        
        var cacheData = candidatesCache[state + '-' + district];
        if (cacheData == undefined) {
            var request = $http.get('/runningData/' + state + '/' + district);
            request.success(function(data) {
                candidatesCache[state + '-' + district] = data;
                $scope.rundata = data;
            });
            request.error(function(data){
                console.log('err');
            });
        } else {
            $scope.rundata = cacheData;
        }
    };
});

// Controller for "Tight Race" page
app.controller('tightController', function($scope, $http) {
    $scope.GetTight = function() {
        var pollModel = document.getElementById('pollModelDropDown').value;
        var threshold = document.getElementById('thresholdDropDown').value;
        var request = $http.get('/tightData/'+threshold+'/'+pollModel);
        request.success(function(data) {
            $scope.tightdata = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    };
});

// Controller for "Num Reps" page
app.controller('repsController', function($scope, $http) {
    $scope.message="";

    var request = $http.get('/repData');
    request.success(function(data) {
        $scope.repData = data;
    });
    request.error(function(data){
        console.log('err');
    });
});

