/**
 *
 *
 *家居顾问管理 > 家居顾问列表
 */

sysController.controller("decorateSellListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.DECORATE.DECORATE_PUB].join(""),{orderBy:"updateTime"});

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");
		
		/*获取默认服务客户数上限-100*/
		$http.get([$window.API.DECORATE.DECORATE_PUB,"/limitConfig"].join("")).success(function(res){
			if(res.stateCode===0&&res.data){
				$scope.toplimit=res.data.toplimit;
			}else {
				errorMsg.make({msg:res.message});
			}
		})
        /*v1.10.0-服务客户数上限*/
        $scope.submitServeClientsCount=function(serveClientsCount){
            if(confirm("确定设置服务客户数上限为:"+serveClientsCount)){
            	$http({ url:[$window.API.DECORATE.DECORATE_PUB,"/limitConfig"].join(""), method:'post', data:{"toplimit":serveClientsCount}}).success(function(res){
           			//console.log(res)
                   	if(res.stateCode===0){
                   		successMsg.make({msg:"操作成功!"})
                       	$scope.refresh();
                   	}else{
                       	errorMsg.make({msg:res.message});
                       	$scope.refresh();
                   	}
                });
            }
        }
        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            console.log(postData)
            $scope.filtering(postData);
        };


        /*区域*/
        $scope.$watch('list.areaId',function(dt){
            if(dt!==undefined){
                postData.areaId=dt;
                $scope.filtering(postData);
            }
        });
        /*是否项目经理*/
        $scope.$watch('list.isManager',function(dt){
            if(dt!==undefined){
                postData.isManager=dt;
                $scope.filtering(postData);
            }
        });

        /*是否接受分配*/
        $scope.$watch('list.isDistribution',function(dt){
            if(dt!==undefined){
                postData.isDistribution=dt;
                $scope.filtering(postData);
            }
        });

        /*状态*/
        $scope.$watch('list.status',function(dt){
            if(dt!==undefined){
                postData.status=dt;
                $scope.filtering(postData);
            }
        });

        /*启用/禁用*/
        $scope.set=function(id,bl){
            if(confirm("确定要"+(bl?'启用':'禁用')+"当前家居顾问？")){
                $http.post([$window.API.DECORATE.DECORATE_PUB,"/",id,(bl?'/active':'/inActive')].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                });
            }
        };



        /*详细*/
        $scope.show=function(id,userId){
            $window.location.href = ["#/main/decorate-sell-list-info?id=", id,"&userId=",userId].join("");
        };

        /*修改*/
        $scope.edit=function(id){
            $window.location.href = ["#/main/decorate-sell-list-create?id=", id].join("");
        };

        /*新增*/
        $scope.add=function(){
            $window.location.href = ["#/main/decorate-sell-list-create"].join("");
        };

    }]);



sysController.factory("tabActive",["$timeout",function($timeout){
    return function(){
        $timeout(function(){
            $timeout(function(){
                var hash=window.location.hash;
                console.log(hash)
                $(".tab-btn li a").each(function(){
                    if(($(this).attr("href"))==hash){
                        $(this).addClass("hover")
                    }else{
                        $(this).removeClass("hover");
                    }
                })

            })
        })
    }

}])

/**
 *
 *
 *家居顾问管理 > 添加/修改
 */
sysController.controller("decorateSellCreateController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","$timeout","$validate",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,$timeout,$validate) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};
        $scope.dataInfo.id=id;

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");


        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;


        /*查询基本信息*/
        if(id){
            $http.get([window.API.DECORATE.DECORATE_PUB,"/",id,"/detailInfo"].join("")).success(function(res){
                if(res.stateCode===0) {
                    $scope.dataInfo = res.data.platformEmployeeDto;

                    $scope.oldAreaId=res.data.platformEmployeeDto.areaId;
                    $scope.oldManager=res.data.platformEmployeeDto.manager;
                    $scope.enable=res.data.enable

                }
            });
        }


        /*查询是否有项目经理*/
        $scope.$watch("dataInfo.areaId",function(aid){
            $scope.isManager=false;

            //修改时候 勾选设置
            if($scope.oldAreaId){
                if(aid!==$scope.oldAreaId){
                    $scope.dataInfo.manager=false;
                }else{
                    $scope.dataInfo.manager=$scope.oldManager;
                }
            }

            if(!aid){
                return false
            }
            $http({ url:[$window.API.DECORATE.DECORATE_PUB,"/",aid,"/manager"].join(""), method:'get'}).success(function(res){
                if(res.stateCode===0){
                    $scope.isManager=res.data.managerName;
                    if(id==res.data.id){
                        $scope.isManager=false
                    }
                }
            });
        });



        /*提交*/
        var pass=true;
        $scope.submit=function(dt){
            var nodes=angular.element(".form-control");
            nodes.blur();

            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeUpErr=angular.element(".upErr"),
                    brandinfo=dt[0];

                if(nodeErr.length!=0||nodeUpErr.length!=0){
                    return false
                }
                console.log(brandinfo);

                if(!pass){
                    return false;
                }
                pass=false;
                $http({ url:[$window.API.DECORATE.DECORATE_SAVE].join(""), method:'post', data:brandinfo}).success(function(res){
                    if(!res.stateCode){
                        pass=true;
                        id?successMsg.make({msg:"修改成功！"}):successMsg.make({msg:"添加成功！"});
                        $window.location.href='/#/main/decorate-sell-list'
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            })
        }



    }])

/**
 *
 *
 *家居顾问管理 > 基本信息
 */
sysController.controller("decorateSellInfoController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$timeout","tabActive",
    function($scope, $http, $window,$grid,$dateTool,$filter,$timeout,tabActive) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        var userId=get_param($window.location.href, "userId")*1;
        $scope.dataInfo={};
        $scope.id=id;
        $scope.userId=userId;
        /*选项卡*/
        tabActive();

        /*查询信息*/
        if(id){
            $http.get([window.API.DECORATE.DECORATE_PUB,"/",id,"/detailInfo"].join("")).success(function(res){
                if(res.stateCode===0) {
                    $scope.dataInfo = res.data;
                }
            });
        }

    }])


/**
 *
 *
 *家居顾问管理 > 推客
 */
sysController.controller("decorateSellTwitterController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","tabActive","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,tabActive,$getSelectTypes) {
        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        var userId=get_param($window.location.href, "userId")*1;
        
        $scope.dataInfo={};
        $scope.id=id;
        $scope.userId=userId;
        $scope.ids=[];
        $scope.seller={};
        /*选项卡*/
        tabActive();

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");

        /*列表数据*/
        $grid.initial($scope, [$window.API.DECORATE.DECORATE_PUB,"/",id,"/twitterList"].join(""),{orderBy:"createTime"});

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };



        /*取消关联*/
        $scope.del=function(tid){
            if(confirm("确定要取消关联当前推客？")){
                $http.post([$window.API.DECORATE.DECORATE_PUB,"/",id,"/cancelRelationTwitter?twitterId=",tid].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make();
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                });
            }
        };



        /*全选*/
        $scope.isAllSelectFun=function(bl,list){
            var arr=[];
            if(bl){
                angular.forEach(list,function(v,i){
                    v.isSelect=bl;
                    arr.push(v.id)
                })
            }
            $scope.ids=arr;
        };

        /*自选*/
        $scope.selectFun=function(list){
            var arr=[];
            angular.forEach(list,function(v,i){
                if(v.isSelect){
                    arr.push(v.id)
                }
            });
            $scope.ids=arr;
        };




        /*获取家居顾问列表*/
        $scope.$watch("seller.areaId",function(aid){
           if(aid){
               $http.get([window.API.DECORATE.DECORATE_PUB,"/",id,"/pes","?areaId=",aid].join("")).success(function(res){
                   if(res.stateCode===0) {
                       $scope.sellerTypes = res.data;
                   }
               });
           }
        });


        /*创建选择家居顾问弹窗*/
        $scope.createDialog=function(){
            $scope.seller.errorMsg=null;
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ispass=true;
        $scope.twitterIdsChangeSeller=function(dt){
            var data=dt;
            console.log(data);
            if($scope.ids.length==0){
                $scope.seller.errorMsg="你还未选择推客!";
                return false
            }
            if(!data.areaId){
                $scope.seller.errorMsg="请选择服务区域!";
                return false
            }
            if(!data.newPeId){
                $scope.seller.errorMsg="请选择家居顾问!";
                return false
            }

            $scope.seller.errorMsg=null;
            delete data.errorMsg;

            if(id&&ispass){
                ispass=false;
                $http({ url:[$window.API.DECORATE.DECORATE_PUB,"/",id,"/twitterChangePe?newPeId=",data.newPeId].join(""), method:'post',data:{ids:$scope.ids}} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.ids=[];
                        $scope.isAllSelect=false;
                        $scope.refresh();// 刷新信息
                        angular.element('.createDialog').modal('hide');
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };


        /*创建选择选择推客弹窗*/
        $scope.createDialogTwitter=function(){
            $scope.errorMsg=null;
            angular.element('.createDialogTwitter').modal({backdrop: 'static', keyboard: false});
			$scope.twitterResult=[];
            /*按条件查询推客*/
            $scope.tSearch=function(dt){
                $scope.errorMsg=null;
                if((dt||"").length<2){
                    $scope.errorMsg="至少输入2位字符";
                    return false
                }
                $http.get([window.API.DECORATE.DECORATE_TWITTER,"?twitter=",dt,"&peId=",id].join("")).success(function(res){
					//console.log(res)
                    if(res.stateCode===0) {
                        $scope.twitterResult = res.data;
                    }
                });
            }
            /*v1.10.0-快速查询所属推客*/
            $scope.qSearch=function(){
            	//273---274行
          		//console.log(id+":"+userId);
            	$http.get([window.API.DECORATE.DECORATE_PUB,"/relationChildTwitterList","?peId=",id,"&userId=",userId].join("")).success(function(res){
            		//console.log(res)
                    if(res.stateCode===0) {
                    	if(res.data){
                    		$scope.twitterResult = res.data;
                    		$scope.qSearchResult = false;//快速查询有数据
                    	}else {
                    		$scope.twitterResult = [];
                    		$scope.qSearchResult = true;//快速查询无数据---显示暂无数据！
                    	}
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };

        /*提交dialog选择推客*/
        var ispass=true;
        $scope.twitterChange=function(res){
            var ids=[];
            angular.forEach(res,function(v,i){
                if(v.isSelect){
                    ids.push(v.id)
                }
            });

            console.log(ids);
            if(ids.length==0){
                $scope.errorMsg="你还未选择推客!";
                return false
            }

            $scope.errorMsg=null;
            if(id&&ispass){
                ispass=false;
                $http({ url:[$window.API.DECORATE.DECORATE_PUB,"/",id,"/relationTwitter"].join(""), method:'post',data:{ids:ids}} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();// 刷新信息
                        angular.element('.createDialogTwitter').modal('hide');
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };

    }]);


/**
 *
 *
 *家居顾问管理 > 客户
 */
sysController.controller("decorateSellCustomerController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","tabActive","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,tabActive,$getSelectTypes) {
        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        var userId=get_param($window.location.href, "userId")*1;
        $scope.dataInfo={};
        $scope.id=id;
        $scope.userId=userId;
        $scope.ids=[];
        $scope.seller={};
        /*选项卡*/
        tabActive();

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");

        /*关联来源枚举*/
        $getSelectTypes.select($scope,[$window.API.DECORATE.DECORATE_TYPES].join(""),null,"allTypes");

        /*列表数据*/
        $grid.initial($scope, [$window.API.DECORATE.DECORATE_PUB,"/",id,"/customerList"].join(""),{orderBy:"createTime"});

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };


        /*全选*/
        $scope.isAllSelectFun=function(bl,list){
            var arr=[];
            if(bl){
                angular.forEach(list,function(v,i){
                    v.isSelect=bl;
                    arr.push(v.userId)
                })
            }
            $scope.ids=arr;
        };

        /*自选*/
        $scope.selectFun=function(bl,list){
            var arr=[];
            angular.forEach(list,function(v,i){
                if(v.isSelect){
                    arr.push(v.userId)
                }
            });
            $scope.ids=arr;
        };

        /*获取家居顾问列表*/

        $http.get([window.API.DECORATE.DECORATE_PUB,"/",id,"/pes"].join("")).success(function(res){
            if(res.stateCode===0) {
                $scope.sellerTypes = res.data;
            }else{
                errorMsg.make({msg:res.message});
            }
        });


        /*创建选择家居顾问弹窗*/
        $scope.createDialog=function(){
            $scope.seller.errorMsg=null;
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ispass=true;
        $scope.twitterIdsChangeSeller=function(dt){
            var data=dt;
            console.log(data)
            if($scope.ids.length==0){
                $scope.seller.errorMsg="你还未选择客户!";
                return false
            }
            //if(!data.areaId){
            //    $scope.seller.errorMsg="请选择服务区域!";
            //    return false
            //}
            if(!data.newPeId){
                $scope.seller.errorMsg="请选择家居顾问!";
                return false
            }

            $scope.seller.errorMsg=null;
            delete data.errorMsg;

            if(id&&ispass){
                ispass=false;
                $http({ url:[$window.API.DECORATE.DECORATE_PUB,"/",id,"/customerChangePe?newPeId=",data.newPeId].join(""), method:'post',data:{ids:$scope.ids}} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.ids=[];
                        $scope.isAllSelect=false;
                        $scope.refresh();// 刷新信息
                        angular.element('.createDialog').modal('hide');
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };


    }]);


/**
 *
 *
 *家居顾问管理 > IM
 */
sysController.controller("decorateSellImController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","tabActive","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,tabActive,$getSelectTypes) {
        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        var userId=get_param($window.location.href, "userId")*1;
        $scope.dataInfo={};
        $scope.id=id;
        $scope.userId=userId;
        /*选项卡*/
        tabActive();

        /*关联来源枚举*/
        $getSelectTypes.select($scope,[$window.API.DECORATE.DECORATE_TYPES].join(""),null,"allTypes");

        /*列表数据*/
        $grid.initial($scope, [$window.API.DECORATE.DECORATE_PUB,"/",id,"/sessionList"].join(""),{orderBy:"createTime"});

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };

        /*关闭会话*/
        $scope.closeIm=function(imId){
            if(confirm("确定要关闭会话？")){
                $http.post([$window.API.DECORATE.DECORATE_PUB,"/",id,"/closeSession","?sessionId=",imId].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make();
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                });

            }


        }


    }])


/**
 *
 *
 *家居顾问管理 > 订单
 */
sysController.controller("decorateSellOrderController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","tabActive","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,tabActive,$getSelectTypes) {
        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        var userId=get_param($window.location.href, "userId")*1;
        $scope.dataInfo={};
        $scope.id=id;
        $scope.userId=userId;
        /*选项卡*/
        tabActive();

        /*关联来源枚举*/
        $getSelectTypes.select($scope,[$window.API.DECORATE.DECORATE_TYPES].join(""),null,"allTypes");

        /*列表数据*/
        $grid.initial($scope, [$window.API.DECORATE.DECORATE_PUB,"/",id,"/orderList"].join(""),{orderBy:"createTime"});

        /*查询*/
        var postData={};
        postData.orderBy="createTime";

        /*状态*/
        $scope.$watch('list.status',function(dt){
            if(dt!==undefined){
                postData.status=dt;
                $scope.filtering(postData);
            }
        });

        /*类型*/
        $scope.$watch('list.type',function(dt){
            if(dt!==undefined){
                postData.type=dt;
                $scope.filtering(postData);
            }
        });

    }])



