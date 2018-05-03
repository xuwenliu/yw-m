/**
 * building
 *
 *楼盘管理 > 楼盘列表
 */
 sysController.controller("buildingListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {

        $grid.initial($scope, [$window.API.BUILDING.BUILDING_LIST].join(""),{orderBy:"createTime"});

        $scope.submitSearch=function(dt){
            var data=angular.copy(dt);
                data.orderBy="createTime";
            if(dt!==undefined){
                $scope.filtering(data);
            }
        };

        $scope.edit=function(id){
           $window.location.href = ["#/main/building-list-add?id=", id].join("");
        };


        $scope.del=function(id){
            if(confirm("您确认要删除该楼盘吗？")){
                $http({ url:[$window.API.BUILDING.BUILDING_DEL,"/",id,"/delete"].join(""), method:'post'} ).success(function(res){
                    if(res.stateCode===0){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }

                });
            }
        };
    }]);




/**
 *
 *楼盘管理 > 楼盘列表 > 添加楼盘
 */

sysController.controller("buildingAddController", ["$scope", "$http", "$window", "$cookieStore","$timeout","$province","$city","$area","$validate","$sce","getSelectName","$rootScope","GET_TOKEN","QINIU","$getArea",
    function ($scope, $http,$window,$cookieStore,$timeout,$province,$city,$area,$validate,$sce,getSelectName,$rootScope,GET_TOKEN,QINIU,$getArea) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};
        $scope.dialogDataInfo={};
        $scope.bedrooms=createJson(10,"室");
        $scope.livingRooms=createJson(6,"厅");
        $scope.toilets=createJson(6,"卫");
        $scope.areaLevelDto={};



        /*构造数据*/
        function createJson(n,str){
            var arr=[];
            for(var j=1;j<=n; j++){
                var o={};
                o['code']=j;
                o['desc']=j+str;
                arr.push(o);
            }
            return arr
        }


        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });


        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=3;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));


        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*获取下拉常用参数*/
        $http.get([$window.API.BUILDING.BUILDING_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.decorationStandard  =res.data.decorationStandard ;//装修标准
            }
        });


        /*城市联动*/
        (function () {
            $province.get()
                .success(function (data) {
                    $scope.provinces=data["data"];
                })
        })();


        //城市
        $scope.$watch("areaLevelDto.one",function(data){
            if(data){
                $city.get({id: data})
                    .success(function (data) {
                        $scope.cities = data["data"];
                    });
            }
        });


        //区域
        $scope.$watch("areaLevelDto.two",function(data){
            if(data){
                $area.get({id: data})
                    .success(function (data) {
                        if(!data.succ){
                            $scope.isAreaShow=false;
                            $scope.areaLevelDto.three=null;
                        }else{
                            $scope.isAreaShow=true;
                        }
                        $scope.areas = data["data"];
                    });
            }
        });


        /*获取楼盘数据*/
        getBuildingInfo(id);
        function getBuildingInfo(id){
            if(id){
                $http.get([$window.API.BUILDING.BUILDING_GET_INFO,"/",id].join("")).success(function(res){
                    if(res.stateCode==0&&res.data){
                        $scope.dataInfo=res.data;
                        $scope.buildingLayouts=res.data.buildingLayouts; //户型列表
                        $getArea.setAreas($scope,res.data.areaId); //地区填充
                    }
                })
            }
        }



        /*删除户型图*/
        $scope.roomsDel=function(dt){
            if(confirm("确定要删除该条数据吗？")){
                $http({ url:[$window.API.BUILDING.BUILDING_ROOMS_DEL,"/",dt[0],"/layout/",dt[1],"/delete"].join(""), method:'post'} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'删除成功!'});
                        getBuildingInfo($scope.dataInfo.id); // 刷新信息
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };



        /*获取房屋指定户型数据*/
        var select=angular.element(".img-show-box");
        function getRoomsInfo(dt){
            if(dt){
                $http.get([$window.API.BUILDING.BUILDING_ROOMS_GET_INFO,"/",$scope.dataInfo.id,"/layout/",dt].join("")).success(function(res){
                    if(res.stateCode==0&&res.data){
                        $scope.dialogDataInfo=res.data;
                        select.attr("data-url",res.data.layoutImage).html(QINIU.creatDom(res.data.layoutImage));
                    }
                })
            }
        }

        /*打开dialog*/
        $scope.createDialog=function(dt){
            if(!$scope.dataInfo.id){
                errorMsg.make({msg:"请保存基本信息后再创建户型！"});
                return false
            }
            getRoomsInfo(dt);
            $scope.dialogDataInfo={};
            select.attr("data-url",$scope.dialogDataInfo.layoutImage).html(QINIU.creatDom($scope.dialogDataInfo.layoutImage));//删除图片
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        $scope.createDialogSumbit=function(dt){
            var data=dt;
            $scope.dialogDataInfo.layoutImage=select.attr('data-url')?select.attr('data-url'):null;
            if(!data.name){
                $scope.dialogDataInfo.errorMsg="户型名称30字符内，不能为纯数字!";
                return false
            }
            if(!data.bedroom){
                $scope.dialogDataInfo.errorMsg="请选择卧室数!";
                return false
            }
            if(!data.livingRoom){
                $scope.dialogDataInfo.errorMsg="请选择客厅数!";
                return false
            }
            if(!data.toilet){
                $scope.dialogDataInfo.errorMsg="请选择卫生间数!";
                return false
            }
            if(!data.houseArea){
                $scope.dialogDataInfo.errorMsg="面积为整数或最多保留2位小数!";
                return false
            }
            $scope.dialogDataInfo.errorMsg=null;
            delete data.errorMsg;
            data.houseArea = data.houseArea*1

            if($scope.dataInfo.id){
                $http({ url:[$window.API.BUILDING.BUILDING_ROOMS_SAVE,"/",$scope.dataInfo.id,"/layout"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        getBuildingInfo($scope.dataInfo.id); // 刷新信息
                        angular.element('.createDialog').modal('hide');
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };



        //提交
        var submitPass=true;//防阻塞
        $scope.submit=function(dt){
            var  infoData=angular.copy(dt[0]);
            infoData.areaId = $getArea.getLastAreaId($scope.areaLevelDto);//获取最后一级的区域ID
            var  nodes=angular.element(".form-control");
            /*保存/校验*/
            dt[1]?nodes.blur().removeClass("rmcolor"):nodes.each(function(){
                var t=$(this);
                if(!!t.val()){
                    t.removeClass("rmcolor");
                    t.blur();
                }else{
                    t.addClass("rmcolor")
                }
            });

            /*请求*/
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeErrRes=angular.element(".err:not(.rmcolor)"),
                    nodeUpErr=angular.element(".upErr"),
                    required=angular.element(".required.err");

                dt[1]?nodeErr.first().focus():required.focus();
                errLen=nodeErrRes.length;
                upErrLen=nodeUpErr.length;
                console.log("errLen:"+errLen+"|"+upErrLen);

                console.log(infoData)
                delete  infoData.buildingLayouts;
                delete  infoData.decorationDesc;
                if(errLen<1&&upErrLen<1&&submitPass){
                    submitPass=false;
                    $http({ url:[$window.API.BUILDING.BUILDING_SAVE].join(""), method:'POST',data:infoData}).success(function(res){
                        if(res.stateCode===0){
                            successMsg.make({msg:"提交成功！"});
                            $scope.dataInfo.id=res.data;
                            //$window.location.href="#/main/activitys";
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                        submitPass=true;
                    })
                }
            });
        };
    }]);






