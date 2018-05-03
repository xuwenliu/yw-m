/**
 *简报
 * **/


sysController.controller("CountController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        $http({ url:$window.API.COUNT.COUNT_LIST, method:'get'} ).success(function(res){
            $scope.result = res.data;
        });
    }
]);

/**
 * 每日数据
 * **/
sysController.controller("EveryDataController", ["$scope", "$http", "$window", "$grid","$dateTool","$filter",
    function ($scope, $http, $window, $grid,$dateTool,$filter) {

        /*初始化数据*/
        $scope.dataInfo={};

        /*列表*/
        $grid.initial($scope, [$window.API.COUNT.EVERY_DAY_COUNT_LIST].join(""),{orderBy:"createTime"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.filtering(postData);
        };


        /*总数据*/
        $http.get([$window.API.COUNT.EVERY_DAY_COUNT_ALL].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.dataInfo=res.data;
            }
        });




    }
]);