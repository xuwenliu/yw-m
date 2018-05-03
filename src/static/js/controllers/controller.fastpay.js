/**
 *快捷收款> 快捷收款列表
 */
sysController.controller("fastPayListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool", "$grid", "$getSelectTypes","$filter","GET_TOKEN","QINIU",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool, $grid, $getSelectTypes,$filter,GET_TOKEN,QINIU) {


        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));


        /*list*/
        $grid.initial($scope, [$window.API.FASTPAY.LIST].join(""),{orderBy:"createTime"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});
        $scope.list={};

        /*获取常用枚举*/
        $http.get([$window.API.FASTPAY.LIST,"/enum"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.payToolTypes =res.data.payToolTypes ; //付款方式
            }
        });

        /*查询*/
        var postData={};
        $scope.submitSearch=function(dt){
            postData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.orderBy='createTime';
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.filtering(postData);
        };

        $scope.$watch('list.bindingCard',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        $scope.$watch('list.developPermission',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        $scope.$watch('list.spreadPermission',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        $scope.$watch('list.withdrawDeposit',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });




        /*打开dialog 修改权限*/
        $scope.roots={};
        $scope.createDialog=function(dt){
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
            var cdt=angular.copy(dt);
            $scope.rootSet=cdt;
            $scope.roots.id=cdt.id;
            $scope.roots.userId=cdt.userId;
            $scope.roots.get=cdt.collectionPermission===2?true:false;
            $scope.roots.develop=cdt.developPermission===2?true:false;
            $scope.roots.spread=cdt.spreadPermission===2?true:false;
        };

        /*提交dialog*/
        $scope.createDialogSumbitRoot=function(dt){
            var data={};
            data.id=dt.id;
            data.userId=dt.userId;
            data.get=dt.get===true?2:3;
            data.develop=dt.develop===true?2:3;
            data.spread=dt.spread===true?2:3;

            delete data.errorMsg;
            if(data){
                $http({ url:[$window.API.FASTPAY.LIST,"/permission"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog').modal('hide');
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };



        /*打开dialog 处理申请*/
        var select=angular.element("#upPhotosBtn").nextAll(".img-show-box");
        $scope.createDialogPayAdd=function(dt){

            $scope.pay={};
            $scope.pay.amount=dt[1];
            $scope.pay.id=dt[0];
            $scope.pay.userId=dt[2];

            select.attr("data-url",$scope.pay.credential ).html(QINIU.creatDom($scope.pay.credential ));//删除图片
            angular.element('.createDialog2').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ispass=true;
        $scope.createDialogSumbitPay=function(dt){
            console.log(select.attr('data-url'));
            $scope.pay.voucher =select.attr('data-url')?select.attr('data-url'):null;
            var data=dt;
            console.log(data)
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher ){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;



            if(ispass){
                ispass=false;
                $http({ url:[$window.API.FASTPAY.LIST,"/brokerage/record"].join(""), method:'post',data:data} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();
                        angular.element('.createDialog2').modal('hide');
                        select.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };




    }]);




