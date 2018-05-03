/**
 *平台业者管理> 平台业者列表
 */
sysController.controller("ManagerListController", ["$scope", "$http", "$window", "$grid",
  function($scope, $http, $window,$grid) {

    //列表
    $grid.initial($scope, $window.API.MANAGER.GET_MANAGER_LIST,{orderBy:"createTime"});
    //查询
    $scope.submitSearch=function(dt){
     //if(dt){
       var postData={};
       postData.name=dt;
       postData.orderBy="createTime";
       $scope.filtering(postData);
     //}
    };

    //启用||禁用
    $scope.isAvailable=function(dt){
      if(confirm(dt[0]?"确定要启用该账户吗？":"确定要禁用该账户吗？")){
        $http({ url:[$window.API.MANAGER.SET_MANAGER_AVAILABLE,"/",dt[1],"/status?available=",dt[0]].join(""), method:'POST', data:{available:!dt[0]} }).success(function(res){
          if(!res.stateCode){
            $scope.refresh();
          }
        })
      }
    };


  }]);

/**
 *平台业者管理> 平台业者添加/编辑
 */
sysController.controller("ManagerAddController", ["$scope", "$http", "$window", "$cookieStore","$validate","$timeout",
  function($scope, $http, $window, $cookieStore, $validate,$timeout) {

    /*数据验证规则*/
    $scope.pubRegex=$validate.pubRegex.rule;
    $scope.managerInfo={quitJobs:false};
    $scope.managerInfo.userDetailType=1;
    $scope.submit=function(dt){
      var nodes=angular.element(".form-control");
      nodes.blur();
      $timeout(function(){
        var nodeErr=angular.element(".err"),
            datainfo=dt[0];
        if(nodeErr.length!=0){
          return false
        }

        console.log(datainfo)
        $http({ url:[$window.API.MANAGER.ADD_MANAGER_INFO].join(""), method:'POST', data:datainfo}).success(function(res){
          if(!res.stateCode){
            successMsg.make({msg:"添加成功！"});
            $window.location.href="#/main/manager"
          }else{
            errorMsg.make({msg:res.message});
          }
        });
      })
    }

  }]);