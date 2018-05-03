/**
 * login , logout
 */

sysController.controller("LoginController", ["$scope", "$http", "$window","$timeout","$cookieStore",
    function ($scope, $http, $window,$timeout,$cookieStore) {
        $cookieStore.get("userName")?$window.location.href="#/main/default":"";
        $scope.loginInfo={ "userName": $cookieStore.get("remember_userName"),"password": ""};
        $scope.login = function (data) {
            var data_ = angular.copy(data);
            $scope.errorMsg="";

            if (!data_.userName) {
                $scope.errorMsg = "用户名格式不正确";
                console.log($scope.errorMsg);
                return false
            }
            if (!data_.password){
                $scope.errorMsg = "密码格式不正确";
                console.log($scope.errorMsg);
                return false
            }

            if (data_.userName && data_.password) {
                data_.password=Rsa(data_.password)
                $scope.errorMsg = "登录中...";
                $scope.ngDisable=true;
                $http.post(window.API.SYS.LOGIN, data_ )
                    .success(function (res) {
                    if (res.stateCode===0) {
                        $cookieStore.put("userName",data_.userName);
                        $cookieStore.put("remember_userName",data_.userName);
                        $scope.errorMsg = "登录中...";
                        $scope.ngDisable=true;
                        $window.location.href = "#/main/default";
                    } else {
                        $scope.errorMsg = res.message;
                        $scope.ngDisable=false;
                    }
                });
            }
        };

        $scope.enterEvent = function (e) {
            if (e.keyCode === 13){
                $scope.login($scope.loginInfo);
            }
        }

        /*获取IM TOKEN*/


    }]);


sysController.controller("userInfoController", ["$scope", "$http", "$window","$cookieStore",
    function ($scope, $http, $window,$cookieStore) {
        $scope.userName= $cookieStore.get("userName");
        /*前端判断*/
        //if(!$cookieStore.get("userName")){
        //    errorMsg.make({msg:"请登录,2秒后自动跳转到登录页!",url:""});
        //}
        $scope.logout = function () {
            if(!confirm("是否要退出系统?")){
                return false
            }
            $http({url:API.SYS.LOGOUT, method:'POST'}).success(function (res) {
                    if(!res.stateCode){
                        $cookieStore.remove("userName");
                        $window.location.href = "";
                    }
                })

        };

    }]);