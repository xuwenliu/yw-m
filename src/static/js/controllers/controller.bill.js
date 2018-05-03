/**
 * bill
 *
 *账单管理 > 账单列表
 */
sysController.controller("BillListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes) {
        /* 列表 */
        $grid.initial($scope, [$window.API.BILL.BILL_LIST].join(""), {"billType":2});

        $http.get([$window.API.BILL.BILL_TYPES].join("")).success(function(res){
            if (res.data) {
                $scope.billTypes = res.data.billTypes;
                $scope.billContentTypes = res.data.billContentTypes;
                $scope.billStatusTypes = res.data.billStatusTypes;

            }
            else {
                errorMsg.make({msg:res.message});
            }
        });

        var postData = {
            "billType": 4
        };

        /* 账单类型筛选 */ 
        $scope.changeType=function(dt){
            postData.billType=dt;
            $scope.filtering(postData);
        };

        /* 账单内容选择 */
        $scope.$watch('list.billContentType',function(dt){
            if(dt!==undefined){
                postData.billContentType = dt;
                $scope.filtering(postData);
            }
        });

        /*账单状态选择*/
        $scope.$watch('list.status',function(dt){
            if(dt!==undefined){
                postData.status = dt;
                $scope.filtering(postData);
            }
        });

        $scope.submitSearch = function(dt) {
            if(dt){
                postData.billNumQueryKey = dt.billNumQueryKey;
                postData.companyNameQueryKey = dt.companyNameQueryKey;
                postData.customerNameQueryKey = dt.customerNameQueryKey;
                postData.customerPhoneQueryKey = dt.customerPhoneQueryKey;
                $scope.filtering(postData);
            }
        }

        $scope.bootDialog = function(id) {
            $scope.dialog = {"billId":id};
        }

        var submitPass=true;
        $scope.submit = function(dt) {
            var infoData = dt;

            if(submitPass){
                submitPass=false;
                $http({ url:[$window.API.BILL.BILL_CONFIRM,infoData.billId].join(""), method:'POST'}).success(function(res){
                    if (res.succ) {
                        successMsg.make({msg:"操作成功"});
                        angular.element('.billModal').modal('hide');
                        $scope.refresh();
                    }
                    else {
                        errorMsg.make({msg:res.message});
                    }
                    submitPass=true;
                });
            }
        }

    }]);

/**
 *
 *账单管理 > 资金账户
 */

sysController.controller("BillAccountController", ["$scope", "$http", "$window","$grid", "$validate", "$timeout",
    function($scope, $http, $window, $grid, $validate, $timeout) {

        // 查询账户金额
        $http.get([$window.API.ACCOUNT.ACCOUNT].join("")).success(function(res){
            if (res.data) {
                $scope.dataInfo = res.data;
            }
            else {
                errorMsg.make({msg:res.message});
            }
        });

    }]);