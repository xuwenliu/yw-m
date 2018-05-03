/**
 * activity
 *
 *活动管理 > 活动列表
 */
 sysController.controller("ActivityListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {

        $grid.initial($scope, [$window.API.ACTIVITY.ACTIVITY_LIST].join(""),{orderBy:"createTime"});//

        /*获取常用枚举*/
        $http.get([$window.API.ACTIVITY.ACTIVITY_TYPES].join("")).success(function(res){
            // console.log(res)
            if(res.stateCode===0){
                $scope.activityScene=res.data.activityScene;//活动场景的类型定义
                $scope.activityStatus=res.data.activityStatus; //活动状态的类型定义
                $scope.activityJustStatus=res.data.activityJustStatus;//活动实时状态的类型定义
            }
        });


        /*查询*/
        $scope.submitSearch=function(dt){
            if(dt){
                var postData=angular.copy(dt)||{};
                postData.orderBy="createTime";
                dt.companyName?postData.companyName=encodeURI(dt.companyName):"";
                $scope.filtering(postData);
            }
        };

        /*修改*/
        $scope.edit=function(id,type){
            if(type==1){//楼盘活动修改
                $window.location.href = ["/#/main/activity-list-add-building?id=", id].join("");
            }else {
                $window.location.href = ["/#/main/activity-list-add?id=", id].join("");
            }

        };
        /*楼盘活动-查看*/
        $scope.lookActivity = function(id) {
            $window.location.href = ["/#/main/activity-list-info?id=", id].join("");
        }
        /*报名入口*/
        $scope.activityJoin=function(id,type){
            // console.log(type)
            if(type==1){//楼盘活动
                $window.location.href = ["/#/main/activity-list-info?id=", id,"&tab=4"].join("");
            }else {
                $window.location.href = ["/#/main/activity-list-join?id=", id].join("");
            }

        };


        /*拼凑二维码*/
        $scope.getQrcode=function(dt){
            return  {"activityId":dt[0],"sign":dt[1]}; //window.APPHOST+"/activity/coupon?activityId="+dt[0]+"&sign="+dt[1]
        };

        /*查看二维码*/
        $scope.showQrcode=function(url,name){
            $scope.qrcode={};
            $scope.qrcode.name=name;

            $("#qrcode").html("");
            var qrcode= new QRCode(document.getElementById("qrcode"), {width : 800, height : 800 });//创建实例
            //qrcode.clear(); // 清除代码
            qrcode.makeCode(JSON.stringify(url));
            angular.element('.myModalCode').modal({backdrop: 'static', keyboard: false});
        };

        /*删除*/
        $scope.del=function(id){
            if(confirm("确定要删除该活动吗？")){
                $http({ url:[$window.API.ACTIVITY.ACTIVITY_DEL,"/",id,"/delete"].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }

                });
            }
        };


        /*上架*/
        $scope.caseUp=function(id){
          if(confirm("确定要上架该活动吗？")){
              $http({ url:[$window.API.ACTIVITY.ACTIVITY_UP,"/",id,"/status?onSale=true"].join(""), method:'post'} ).success(function(res){
                  if(!res.stateCode){
                      $scope.refresh();
                  }else{
                      errorMsg.make({msg:res.message});
                      $scope.refresh();
                  }

              });

          }
        };

        /*下架*/
        $scope.caseDown=function(id){
            if(confirm("确定要下架该活动吗？")){
                $http({ url:[$window.API.ACTIVITY.ACTIVITY_DOWN,"/",id,"/status?onSale=false"].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });

            }
        };

    }]);

/**
*活动管理 > 活动列表 > 报名列表
*/


sysController.controller("ActivityJoinListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $grid.initial($scope, [$window.API.ACTIVITY.ACTIVITY_JOIN_LIST,"/",id,"/customer"].join(""),{orderBy:"createTime"});//

        /*查询*/
        $scope.submitSearch=function(dt){
            if(dt){
                var postData=angular.copy(dt)||{};
                postData.orderBy="createTime";
                $scope.filtering(postData);
            }
        };

        /*导出excel*/
        $scope.submitExcel=function(dt){
            var postData=angular.copy(dt)||{};
            $window.location.href=[$window.API.ACTIVITY.ACTIVITY_JOIN_LIST,"/",id,"/customer/export","?name=",postData.name,"&phone=",postData.phone,"&use=",postData.use].join("")
            //successMsg.make({msg:"导出成功,自动下载！"});

        };

        /*签到*/
        $scope.submitCheck=function(dt){
            if(dt){
                $http({ url:[$window.API.ACTIVITY.ACTIVITY_COUPON_USE,"?couponCode=",dt].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        successMsg.make({msg:"签到成功！"});
                        $scope.filtering({orderBy:"createTime"});
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };
    }]);


/**
 *活动管理 > 活动列表 > 添加/修改活动
 */

sysController.controller("ActivityAddController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout","$dateTool","$filter","$grid","$rootScope","$getSelectTypes",
    function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout,$dateTool,$filter,$grid,$rootScope,$getSelectTypes) {


        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.id=id;
        $scope.dataInfo={};
        $scope.dataInfo.relativePhones=[];
        var UEC='';//富文本数据
        var IDARR=[];//选择预案ID
        var DATAARR=[];//完预案列表
        /*初始化富文本编辑器*/
        var ue = UE.getEditor('editor');
        var coverImage=angular.element("#coverImage").nextAll(".img-show-box");

        if(ue){ // 特殊处理需要页内加载资源
            $(".content-box").css({"display":"block"})
        }


        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),{"id":"0",name:"全部"},"cityTypes");




        /*调用七牛上传*/
        var maxLen=3,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"coverImage"}));
        /*富文本填写校验*/
        checkUe();
        function checkUe(){
           ue.addListener('blur',function(){
               UEC=UE.getEditor('editor').getContent();
               if(!UEC){
                   angular.element("#editor").addClass("err");
                   return false
               }
               angular.element("#editor").removeClass("err");
           });
        }

        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });

        /*添加客服电话*/
        $scope.joinServicePhoneModel=function(dt){
            if(dt){
                var data=dt;
                var arr=$scope.dataInfo.relativePhones;
                if(arr.indexOf(data)>-1){
                    $scope.servicePhoneErr = "电话号码已存在！";
                    return false
                }
                arr.push(data);
                $scope.servicePhoneModel=null;
                $scope.servicePhoneErr=""
            }else {
                $scope.servicePhoneErr = "请输入正确的电话号码！"
            }
        };

        /*删除电话*/
        $scope.DelServicePhoneModel=function(dt,i){
            if(dt){
                var arr=$scope.dataInfo.relativePhones;
                arr.splice(i,1)
            }
        };




        /*获取常用枚举*/
        $http.get([$window.API.ACTIVITY.ACTIVITY_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.activityType=res.data.activityType;//活动类型定义
                $scope.activityScene=res.data.activityScene;//活动场景的类型定义
                $scope.activityStatus=res.data.activityStatus; //活动状态的类型定义
                $scope.activityJustStatus=res.data.activityJustStatus;//活动实时状态的类型定义
            }
        });



        /*获取优惠券列表下拉*/
        $http.get([$window.API.COUPON.COUPON_LIST,"?couponType=3&orderBy=createTime&isAsc=false&pageSize=100&pageNum=1"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.couponNames=res.data.result;
            }
        });

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd hh:ii:00",minView :0});

        /*获取预案数据方法*/
        function getCasesInfo(d,key,dt,rkey){
            for(var j in d){
                if(d[j][key]===dt){
                    return d[j][rkey]
                }
            }
        }

        /*获取数据*/
        if(id&&ue){
            $http.get([$window.API.ACTIVITY.ACTIVITY_INFO,"/",id].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.dataInfo=res.data;
                    $scope.dataInfo.cityId=res.data.cityId===0?String(res.data.cityId):res.data.cityId;
                    $scope.activityStatus=res.data.activityStatus;
                    coverImage.attr("data-url",res.data.coverImage).html(QINIU.creatDom(res.data.coverImage));
                    $timeout(function(){
                        ue.setContent(res.data.content);
                    },1000);

                    angular.element("#beginTime").val($filter('date')(res.data.beginTime, 'yyyy-MM-dd HH:mm:ss'));
                    angular.element("#endTime").val( $filter('date')(res.data.endTime, 'yyyy-MM-dd HH:mm:ss'));
                    $scope.oldBuildingId=res.data.buildingId;

                    $scope.dataInfo.relativePhones=res.data.relativePhones||[]

                    /*初始化户型*/
                    $scope.getBuildingRooms(res.data.buildingId);

                    /*获取统计数*/
                    var cases=res.data['buildingLayoutCases']||[];
                    $scope.getCaseCount=function(dt){
                        return getCasesInfo(cases,"layoutId",dt,"caseCount")
                    }

                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        }


        $scope.$watch("dataInfo.type",function(dt){
            dt===0?location.href="/#/main/activity-list-add?id="+id:"";
            dt===1?location.href="/#/main/activity-list-add-building?id="+id:"";
        });

        /**
         * 获取楼盘
         * */
        $scope.pageSize=10;
        $scope.dialogActivityBuilding=function(){//创建dialog及数据
            $scope.grid=[]; //注销并初始化
            $grid.initial($scope, $window.API.BUILDING.BUILDING_LIST,{"pageSize":10});
            angular.element('.myModalActivityBuilding').modal({backdrop: 'static', keyboard: false});
        };

        $scope.chooseActivityBuilding=function(dt){//选取楼盘
            // console.log(dt)
            $scope.dataInfo.buildingId=dt[0];
            $scope.dataInfo.buildingName=dt[1];
            angular.element('.myModalActivityBuilding').modal('hide');
            $scope.getBuildingRooms(dt[0]);//初始化户型

        };

        $scope.getBuildingRooms=function(dt){//查询指定楼盘户型
            if(dt){
                $http.get([$window.API.BUILDING.BUILDING_GET_INFO,"/",dt].join("")).success(function(res){
                    if(res.stateCode==0&&res.data){
                        $scope.buildingLayouts=res.data.buildingLayouts; //户型列表
                    }
                })
            }


        };


        /*选择样板间选项卡*/
        angular.element(".roomsTab li").click(function(){
            var t=$(this),i=t.index();
            $(".roomsContent").eq(i).show().siblings(".roomsContent").hide();
            t.addClass("hover").siblings("li").removeClass("hover")
        });



        /**
         * 选择预案模块
         *
         * **/

        /*打开dialog*/
        $scope.createDialog=function(dt){
            if(!$scope.dataInfo.id){
                errorMsg.make({msg:"请保存活动后再选择虚拟样板间！"});
                return false
            }
            if($scope.oldBuildingId!==$scope.dataInfo.buildingId){
                $scope.submit([$scope.dataInfo,true]);
                return false
            }

            $scope.layoutId=dt[0];

            /*修改获取预案ID列表*/
            IDARR=getCasesInfo(angular.copy($scope.dataInfo['buildingLayoutCases'])||[],"layoutId",dt[0],"caseIds")||[]; //注意 copy
            counts(IDARR);

            /*预案列表同步序列*/
            function setCaseList(dt,ids){
                var arr=[];
                ids.forEach(function(m){
                    for(var k in dt){
                        if(dt[k]['caseId']===m){
                            arr.push(dt[k])
                        }
                    }
                });
                return arr
            }


            /*获取已选择预案完整列表*/
            $http({ url:[$window.API.ACTIVITY.ACTIVITY_DO_CASES,"/",$scope.dataInfo.id,"/",$scope.dataInfo.buildingId,"/",$scope.layoutId,"/cases"].join(""),method:'get'} ).success(function(res){
                if(res.stateCode===0){
                    $scope.chooseCaseList = setCaseList(res.data.result||[],IDARR||[]);
                    $scope.chooseCasesCount = IDARR.length||0;
                    DATAARR=$scope.chooseCaseList;
                }
            });

            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
            $scope.grid=[]; //注销并初始化
            $grid.initial($scope, $window.API.ACTIVITY.ACTIVITY_GET_CASES+"/"+$scope.dataInfo.id+"/cases",{"pageSize":10});


            /*初始选择的样式*/
            function inputStatusStyle(ids){
                $(".dialog-content input").prop("checked",false);
                for(var k in ids ){
                    $("input[value='"+ids[k]+"'").prop("checked",true)
                }
            }
            /*渲染完成后执行*/
            $scope.$on('ngFinish', function () {
                inputStatusStyle(IDARR);

                $scope.ChooseCasecheckedStatus=function(){
                    /*渲染完成后执行*/
                    inputStatusStyle(IDARR);
                }
            });

            /*查询*/
            $scope.submitSearch=function(dt){
                if(dt!==undefined){
                    $scope.list['orderBy']="createTime";
                    // console.log($scope.list);
                    $scope.filtering($scope.list);
                }
            };
        };


        /*基于ID 获取完整数据*/
        function getGridArr(id){
            var def=$scope.grid['result'];
            var o=null;
            for(var j in def){
                if(def[j]["caseId"]==id){
                    delete def[j].$$hashKey;
                    o=def[j];
                }
            }
            return o
        }

        /*数字统计*/
        function counts(l){
            angular.element(".roomsTab i").text(l.length);
        }


        /*实时选择*/
        $scope.$on('ngFinish', function () {
            $(".createDialog").on("click",".checkbox-list",function(){
                var t=$(this),cid=t.val()*1;
                if(t.is(":checked")&&IDARR.indexOf(cid)<0){
                    IDARR.push(cid);
                    DATAARR.push(getGridArr(t.val()));
                }else if(!(t.is(":checked"))&&IDARR.indexOf(cid)>-1){
                    var i=IDARR.indexOf(cid);
                    IDARR.splice(i,1);
                    DATAARR.splice(i,1);
                }
                counts(IDARR);
                //console.log(IDARR);
                //console.log(DATAARR);



            });
        });

        /*动态更改选择的完整预案数量*/
        $scope.changeChooseCaseList=function(){
            $scope.chooseCaseList=DATAARR

        };

        /*删除已经选中的预案*/
        $scope.delChooseCaseList=function(dt){
            var i=IDARR.indexOf(dt[0]);
            IDARR.splice(i,1);
            DATAARR.splice(i,1);
            counts(IDARR);
            // console.log(IDARR)

        };


        /*提交选择的样板间ID*/
        $scope.createDialogSumbit=function(){
            $http({ url:[$window.API.ACTIVITY.ACTIVITY_DO_CASES,"/",$scope.dataInfo.id,"/",$scope.dataInfo.buildingId,"/",$scope.layoutId,"/cases"].join(""), data:{caseIds:IDARR},method:'post'} ).success(function(res){
                if(res.stateCode===0){
                    successMsg.make({msg:"选择成功！"});
                    angular.element('.createDialog').modal('hide');
                    $timeout(function(){
                       $window.location.reload();
                    },1000)
                }else{
                    errorMsg.make({msg:res.message});
                }
            });
        };



        /**
         * 提交模块
         * **/
        var submitPass=true;//防阻塞
        $scope.submit=function(dt){
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
            $scope.dataInfo.coverImage=coverImage.attr("data-url")||null;

            var  infoData=angular.copy(dt[0]);
            infoData.content=ue.getContent();//富文本
            if(!infoData.content){
                angular.element("#editor").addClass("err");
            }else{
                angular.element("#editor").removeClass("err");
            }

            infoData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd HH:mm:ss');
            infoData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd HH:mm:ss');

            var  nodes=angular.element(".form-control");

            // console.log(infoData)

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

            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box:not('.create-dialog')","bl":dt[1]});

            /*请求*/
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeErrRes=angular.element(".err:not(.rmcolor)"),
                    nodeUpErr=angular.element(".upErr"),
                    required=angular.element(".required.err");

                dt[1]?nodeErr.first().focus():required.focus();
                errLen=nodeErrRes.length;
                upErrLen=nodeUpErr.length;
                // console.log("errLen:"+errLen+"|"+upErrLen);

                // console.log(infoData)
                if(errLen<1&&upErrLen<1&&submitPass){
                    submitPass=false;
                    $http({ url:[$window.API.ACTIVITY.ACTIVITY_SAVE].join(""), method:"POST",data:infoData}).success(function(res){
                        if(!res.stateCode){
                            successMsg.make({msg:"提交成功！"});
                            $window.location.href="/#/main/activity-list-add?id="+res.data;
                            $timeout(function(){
                                $window.location.reload();
                            },1000)
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                        submitPass=true;
                    })
                }
            });
        };
    }]);

/**
 *活动管理 > 活动列表 >新增/修改[楼盘活动]
 */


sysController.controller("ActivityAddBuildingController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout","$dateTool","$filter","$grid","$rootScope","$getSelectTypes",
    function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout,$dateTool,$filter,$grid,$rootScope,$getSelectTypes) {


        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.id=id;
        $scope.dataInfo={};
        $scope.dataInfo.relativePhones=[];
        $scope.enrollNotice=null;
        $scope.dataInfo.enrollNoticeInfos=[]; //通知
        $scope.arriveNotice=null;
        $scope.dataInfo.arriveNoticeInfos=[]; //到店通知
        $scope.servicePhoneErr="";
        $scope.servicePhoneErr2="";

        var UEC='';//富文本数据
        /*初始化富文本编辑器*/
        var ue = UE.getEditor('editor');
        var coverImage=angular.element("#coverImage").nextAll(".img-show-box");

        if(ue){ // 特殊处理需要页内加载资源
            $(".content-box").css({"display":"block"})
        }


        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),{"id":"0",name:"全部"},"cityTypes");


        /*调用七牛上传*/
        var maxLen=3,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"coverImage"}));
        /*富文本填写校验*/
        checkUe();
        function checkUe(){
            ue.addListener('blur',function(){
                UEC=UE.getEditor('editor').getContent();
                if(!UEC){
                    angular.element("#editor").addClass("err");
                    return false
                }
                angular.element("#editor").removeClass("err");
            });
        }

        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });

        /*防止重复*/
        $scope.noSome=function(dt,arr,type){
            var t=type||0;
            var arr=arr||[];
            var i=0;
            if(!dt){return false}
            var data=angular.copy(dt);
            // console.log(data)
            // console.log(arr)
            arr.forEach(function(x){
                if(x.userPhone==data.userPhone){
                    i++
                }
            });
            // console.log(t,"|",i)
            return (t==0&&i>0)?true:(t>0&&i>1)?true:false

        };
        /*添加电话号码*/
        $scope.joincallModel=function(dt,arr,err){
            if(dt){
                var arr=arr||[];
                var data=angular.copy(dt);
                var bl=$scope.noSome(data,arr);
                if(bl||!dt.userPhone){
                    dt.servicePhoneErr="电话号码未填写或已存在";
                    return false
                }
                if(!dt.noticeType){
                    dt.servicePhoneErr= "请选择通知人员类型！";
                    return false
                }
                delete data.servicePhoneErr;
                arr.push(data);
                dt.userPhone=null;
                dt.servicePhoneErr="";
                dt.remarks=null

            }
        };

        /*删除电话*/
        $scope.DelServicePhoneModel=function(dt,i,arr){
            if(dt){
                arr.splice(i,1)
            }
        };




        /*获取常用枚举*/
        $http.get([$window.API.ACTIVITY.ACTIVITY_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.activityType=res.data.activityType;//活动类型定义
                $scope.activityScene=res.data.activityScene;//活动场景的类型定义
                $scope.activityStatus=res.data.activityStatus; //活动状态的类型定义
                $scope.activityJustStatus=res.data.activityJustStatus;//活动实时状态的类型定义
                $scope.noticeTypes=res.data.noticeType //发送短信用户类型
            }
        });



        /*获取优惠券列表下拉*/
        $http.get([$window.API.COUPON.COUPON_LIST,"?couponType=3&orderBy=createTime&isAsc=false&pageSize=100&pageNum=1"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.couponNames=res.data.result;
            }
        });

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd hh:ii:00",minView :0});



        /*获取数据*/
        if(id&&ue){
            $http.get([$window.API.ACTIVITY.ACTIVITY_INFO,"/",id].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.dataInfo=res.data;
                    $scope.dataInfo.cityId=res.data.cityId===0?String(res.data.cityId):res.data.cityId;
                    $scope.activityStatus=res.data.activityStatus;
                    coverImage.attr("data-url",res.data.coverImage).html(QINIU.creatDom(res.data.coverImage));
                    $timeout(function(){
                        ue.setContent(res.data.content);
                    },1000);

                    angular.element("#beginTime").val($filter('date')(res.data.beginTime, 'yyyy-MM-dd HH:mm:ss'));
                    angular.element("#endTime").val( $filter('date')(res.data.endTime, 'yyyy-MM-dd HH:mm:ss'));
                    $scope.oldBuildingId=res.data.buildingId;

                    $scope.dataInfo.enrollNoticeInfos=res.data.enrollNoticeInfos||[]; //通知
                    $scope.dataInfo.arriveNoticeInfos=res.data.arriveNoticeInfos||[]; //到店通知



                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        }

        $scope.$watch("dataInfo.type",function(dt){
            dt===0?location.href="/#/main/activity-list-add?id="+id:"";
            dt===1?location.href="/#/main/activity-list-add-building?id="+id:"";
        });

        /**
         * 提交模块
         * **/
        var submitPass=true;//防阻塞
        $scope.submit=function(dt){
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
            $scope.dataInfo.coverImage=coverImage.attr("data-url")||null;

            var  infoData=angular.copy(dt[0]);
            infoData.content=ue.getContent();//富文本
            if(!infoData.content){
                angular.element("#editor").addClass("err");
            }else{
                angular.element("#editor").removeClass("err");
            }

            infoData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd HH:mm:ss');
            infoData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd HH:mm:ss');

            var  nodes=angular.element(".form-control");

            // console.log(infoData)

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

            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box:not('.create-dialog')","bl":dt[1]});

            /*请求*/
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeErrRes=angular.element(".err:not(.rmcolor)"),
                    nodeUpErr=angular.element(".upErr"),
                    required=angular.element(".required.err");

                dt[1]?nodeErr.first().focus():required.focus();
                errLen=nodeErrRes.length;
                upErrLen=nodeUpErr.length;
                // console.log("errLen:"+errLen+"|"+upErrLen);

                // console.log(infoData)
                if(errLen<1&&upErrLen<1&&submitPass){
                    submitPass=false;
                    $http({ url:[$window.API.ACTIVITY.ACTIVITY_SAVE].join(""), method:"POST",data:infoData}).success(function(res){
                        if(!res.stateCode){
                            successMsg.make({msg:"提交成功！"});
                            $window.location.href="/#/main/activity-list-add-building?id="+res.data;
                            $timeout(function(){
                                $window.location.reload();
                            },1000)
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                        submitPass=true;
                    })
                }
            });
        };




    }]);

 /**
  *活动管理 > 活动列表 >活动详情
  */
sysController.controller("ActivityListInfoController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout","$dateTool","$filter","$grid","$rootScope","$getSelectTypes",
        function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout,$dateTool,$filter,$grid,$rootScope,$getSelectTypes) {

            // 获取活动id
            var activityId=get_param($window.location.href, "id")*1;
            var tabIndex = get_param($window.location.href, "tab")*1;

            /*数据验证规则*/
            $scope.pubRegex=$validate.pubRegex.rule;
            $scope.pubRegex.numberOfPeople=/^[0-9][0-9]{0,6}$/;//输入人数限制0-999999
            /*查看大图*/
            var eo=$(".content-box");
            eo.on("click",".preview-img",function(){
                var url=$(this).find("img").attr("data-img");
                $timeout(function(){
                    $scope.preview=url;
                })
            });
            if(tabIndex==2||tabIndex==4){
                tabFun(tabIndex,activityId);
            }

            /**
             * [TAB切换]
             * @return {[type]} [description]
             */
            function tabFun(i,activityId){
                $(".tab-btn li a").eq(i).addClass("hover").siblings("a").removeClass("hover");
                $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
                // console.log(i)
                switch(i) {
                    case 1:TAB1(activityId);break;
                    case 2:TAB2(activityId);break;
                    case 3:TAB3(activityId);break;
                    case 4:TAB4(activityId);break;
                }
            }

            $(".tab-btn li a").click(function(){
                var t=$(this),i=t.index();
                tabFun(i,activityId);

            });
            /*TAB0 获取活动-基本信息*/
            $http.get([$window.API.ACTIVITY.ACTIVITY_DETAILS,"/",activityId].join("")).success(function(res){
            	// console.log(res)
                if(res.stateCode===0){
                    $scope.activityDataInfo =res.data;
                }
            });

/*####################################################################################################################################*/
            /**
             * [TAB1 大奖进度公示]
             * @param       {[type]} activityId [description]
             * @constructor
             */
            function TAB1(activityId){
                /*获取大奖进度人数*/
                //http://192.168.28.78:8181/activity/award/progress?activityId=28
                $http.get([$window.API.ACTIVITY.ACTIVITY_AWARD_PROGRESS,"?activityId=",activityId].join("")).success(function(res){
                	// console.log(res)
                    if(res.stateCode===0){
                        $scope.progressDataInfo =res.data;
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });

                /**
                 * [提交大奖进度人数]
                 * @param  {[type]} population [description]
                 * @return {[type]}            [description]
                 */
                $scope.submitPopulation=function(dt){
                    dt.activityId=activityId;
                    var nodes=angular.element(".form-control");
              		nodes.blur();
                	$timeout(function(){
            	        var nodeErr=angular.element(".err");
            	        if(nodeErr.length!=0){
            	          	return false;
            	        }
                        if(dt.nowPersonCount>dt.maxPersonCount){
                            alert("当前参与人数不能大于活动开奖达成人数");
                            return false;
                        }
                        // console.log(dt);
                        $http({ url:[$window.API.ACTIVITY.ACTIVITY_AWARD_PROGRESS].join(""), method:"POST",data:dt}).success(function(res){
                            if(!res.stateCode){
                                successMsg.make({msg:"提交成功！"});
                            }else{
                                errorMsg.make({msg:res.message});
                            }
                        })
                    })
                }
            }

/*####################################################################################################################################*/
            /**
             * [TAB2 活动中奖宣传]
             * @param       {[type]} activityId [description]
             * @constructor
             */
            function TAB2(activityId){
                $scope.activityId = activityId;
                $grid.initial($scope, [$window.API.ACTIVITY.ACTIVITY_PROPAGANDA_LIST,"/",activityId,"/propagandaList"].join(""),{orderBy:"createTime"});
                /**
                 * [description]
                 * @param  {[type]} type [1=新增，2=查看，3=修改]
                 * @param  {[type]} propagandaId   [中奖宣传id]
                 * @return {[type]}      [description]
                 */
                $scope.edit = function(type,activityId,propagandaId){
                    if(propagandaId){
                        $window.location.href = ["/#/main/activity-list-prize-publicity?t=",type,"&aId=",activityId,"&xId=",propagandaId].join("");
                    }else {
                        $window.location.href = ["/#/main/activity-list-prize-publicity?aId=",activityId].join("");
                    }

                }
                /**
                 * [删除活动中奖宣传]
                 * @param  {[type]} propagandaId [description]
                 * @return {[type]}              [description]
                 */
                $scope.delActivityPublicity = function(propagandaId){
                    if(confirm("确定要删除该活动中奖宣传吗？")){
                        //http://192.168.28.78:8181/activity/delete/propaganda?propagandaId=12
                        $http({ url:[$window.API.ACTIVITY.ACTIVITY_DELETE_PROPAGANDA,"?propagandaId=",propagandaId].join(""), method:'post'} ).success(function(res){
                            if(!res.stateCode){
                                successMsg.make({msg:"删除成功！"});
                                $scope.refresh();
                            }else{
                                errorMsg.make({msg:res.message});
                                $scope.refresh();
                            }

                        });
                    }
                }

            }
/*####################################################################################################################################*/
            /**
             * [TAB3 参与公司列表]
             * @param       {[type]} activityId [description]
             * @constructor
             */

            function TAB3(activityId){
                $scope.activityId = activityId;
                /*数据验证规则*/
                $scope.pubRegex=$validate.pubRegex.rule;

                /*获取常用枚举*/
                $http.get([$window.API.ACTIVITY.ACTIVITY_TYPES].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.activityCompanyStates=res.data.activityCompanyStates;//活动公司状态的类型定义,
                        $scope.activityCompanyGroups=res.data.activityCompanyGroups; //活动公司组别的类型定义
                    }
                });
                /*列表数据*/

                $scope.getAddCompany=function(){
                    $grid.initial($scope, [$window.API.ACTIVITY.ACTIVITY_LIST,"/",activityId,"/company"].join(""),{orderBy:"createTime"});
                };
                $scope.getAddCompany();
                /*查询*/
                var postData={};
                postData.orderBy="createTime";
                $scope.submitSearch=function(dt){
                    if(dt!==undefined){
                        $scope.lists['orderBy']="createTime";
                        $scope.filtering($scope.lists);
                    }
                };
                $scope.$watch("lists.state",function(dt){
                    postData.state=dt==-1?"":dt;
                    $scope.filtering(postData);
                })
                $scope.$watch("lists.groupType",function(dt){
                    postData.groupType=dt==-1?"":dt;
                    $scope.filtering(postData);

                })




                /* 获取公司*/
                $scope.dialogMyModalChooseCompany=function(dt){//创建dialog及数据
                    $scope.dialogInfo={};
                    $scope.companys=[];
                    if(dt){
                        $scope.dialogInfo.id=dt.id;
                        $scope.dialogInfo.simpleName=dt.simpleName;
                        $scope.dialogInfo.name=dt.name;
                        $scope.dialogInfo.groupType=dt.groupType;
                        $scope.dialogInfo.companyId=dt.companyId;
                        $scope.dialogInfo.notifyPhone=dt.notifyPhone;
                    }


                    $scope.showCompany=!dt;
                    angular.element('.myModalChooseCompany').modal({backdrop: 'static', keyboard: false});
                    $scope.searchCompany=function(dt){
                        $http.get([$window.API.COMPANY.COMPANY_LIST,"?orderBy=updateTime&isAsc=false&pageNum=1&pageSize=10&isComplete=true&companyName=",dt].join("")).success(function(res){
                            if(res.stateCode===0){
                                $scope.companys=res.data;
                            }
                        });
                    }
                };
                $scope.submitChooseCompany=function(dt){//选取楼盘
                    console.log(dt)
                    $scope.dialogInfo.companyId=dt[0];
                    $scope.dialogInfo.name=dt[1];
                    $scope.dialogInfo.notifyPhone=dt[2];
                    successMsg.make({msg:"公司已选择！"});

                };
                $scope.submitChooseCompanyDialog=function(dialogInfo){
                    var data=angular.copy(dialogInfo)
                    if(!data.name){
                        $scope.dialogInfo.errorText="请选择公司！";
                        return false
                    }
                    if(!data.simpleName){
                        $scope.dialogInfo.errorText="请设置公司简称！";
                        return false
                    }
                    if(!data.groupType){
                        $scope.dialogInfo.errorText="请选择分组!";
                        return false
                    }

                    if(!data.notifyPhone){
                        $scope.dialogInfo.errorText="手机号码不正确!";
                        return false
                    }


                    delete data.name;
                    delete data.errorText;

                    $http.post([$window.API.ACTIVITY.ACTIVITY_LIST,"/",$scope.activityId,"/company"].join(""),data).success(function(res){
                        if(res.stateCode===0){
                            successMsg.make({msg:"操作成功！"});
                            $scope.getAddCompany();
                            angular.element('.myModalChooseCompany').modal('hide');
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                    });

                }

                /*上下架*/
                $scope.isOnCompany=function(id,aid,s){
                    if(confirm("确定要"+(s===1?'上架':'下架')+"该公司吗？")){
                        $http.post([$window.API.ACTIVITY.ACTIVITY_LIST,"/",aid,"/company/",id,"/state?state=",s].join("")).success(function(res){
                            if(res.stateCode===0){
                                successMsg.make();
                                $scope.getAddCompany()
                            }else{
                                errorMsg.make({msg:res.message});
                                $scope.getAddCompany()
                            }

                        });
                    }
                }
            }
/*####################################################################################################################################*/
            /**
             * [TAB4 报名列表]
             * @param       {[type]} activityId [description]
             * @constructor
             */
            function TAB4(activityId){
                $scope.activityId = activityId;
                $grid.initial($scope, [$window.API.ACTIVITY.ACTIVITY_ENROLLLIST,"/",activityId,"/enrollList"].join(""),{orderBy:"createTime"});
                /*查询*/
                var postData={};
                postData.orderBy="createTime";
                $scope.submitSearch=function(dt){
                    var dt=angular.copy(dt)||{};
                    dt.companyName?postData.companyName=dt.companyName:postData.companyName="";
                    dt.phone?postData.phone=dt.phone:postData.phone="";
                    // console.log(postData)
                    $scope.filtering(postData);
                };


                /*是否到店*/
                $scope.$watch('list.arrive',function(dt){
                    postData.arrive=dt==-1?"":dt;
                    $scope.filtering(postData);
                });
                /*合同审核状态*/
                $scope.$watch('list.state',function(dt){
                    postData.state=dt==-1?"":dt;
                    $scope.filtering(postData);
                });
                /**
                 * [查看客户信息]
                 * @param  {[type]} enrollId [description]
                 * @return {[type]}          [description]
                 */
                $scope.lookCustomerInfo = function(enrollId) {
                    angular.element('.createDialog-lookCustomerInfo').modal({backdrop: 'static', keyboard: false});
                    /**
                     * [获取客户信息]
                     * @param  {[type]} res [description]
                     * @return {[type]}     [description]
                     */

                    $http.get([$window.API.ACTIVITY.ACTIVITY_ENROLLINFO,"/",enrollId,"/enrollInfo"].join("")).success(function(res){
                    	// console.log(res)
                        if(res.stateCode===0){
                            $scope.customerDataInfo =res.data;
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                    });

                }
                /**
                 * [查看客户信息-确定]
                 * @return {[type]} [description]
                 */
                $scope.sure = function(){
                    angular.element('.createDialog-lookCustomerInfo').modal('hide');
                }
                /**
                 * [查看、审核合同]
                 * @param  {[type]} enrollId [description]
                 * @return {[type]}          [description]
                 */
                $scope.checkTheContract = function(enrollId){
                    /*查看大图*/
                    var eo=$(".imgShow");
                    eo.on("click",".preview-img",function(){
                        var url=$(this).find("img").attr("data-img");
                        $timeout(function(){
                            $scope.preview=url;
                        })
                    });
                    angular.element('.createDialog-checkTheContract').modal({backdrop: 'static', keyboard: false});

                    $http.get([$window.API.ACTIVITY.ACTIVITY_CONTRACT,"/",enrollId,"/contract"].join("")).success(function(res){
                    	// console.log(res)
                        if(res.stateCode===0){
                            $scope.contractDataInfo =res.data;
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                    });
                }
                /**
                 * [审核通过，转换为待审核]
                 * @param  {[type]} dt [description]
                 * @return {[type]}    [description]
                 */
                $scope.submitCheckTheContract = function(dt) {
                    // console.log(dt)
                    if(dt.state==1){//审核通过
                        var api = [$window.API.ACTIVITY.ACTIVITY_CONTRACT,"/",dt.enrollId,"/changeToAgree"].join("");
                    }else {//转换为待审核
                        var api = [$window.API.ACTIVITY.ACTIVITY_CONTRACT,"/",dt.enrollId,"/changeToDisagree"].join("");
                    }
                    $http({ url:api, method:'post'} ).success(function(res){
                        if(!res.stateCode){
                            successMsg.make({msg:"审核成功！"});
                            angular.element('.createDialog-checkTheContract').modal('hide');
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
 *活动管理 > 活动列表 >活动详情>公司列表>公司详情
 */

sysController.controller("ActivityCompanyInfoController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout","$dateTool","$filter","$grid","$rootScope","$getSelectTypes",
    function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout,$dateTool,$filter,$grid,$rootScope,$getSelectTypes) {

        //初始数据
        var id=get_param($window.location.href, "activityId");
        var tab=get_param($window.location.href, "tab");
        var cid=get_param($window.location.href, "id");
        $scope.getId=id;
        $scope.cid=cid;
        console.log(tab)
        angular.element(".tab-btn a").eq(tab).addClass("hover");

        /*调用七牛上传*/
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(1,1,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn"}));




        ///*选项卡*/
         angular.element(".tab-btn a").click(function(){
             var t=$(this),
                 i= t.index(),
                 o=angular.element(".tab-btn-content>ul>li");
             t.addClass("hover").siblings().removeClass("hover");
             o.eq(i).show().siblings().hide();
             i==1?$scope.getCase():"";
             i==2?$scope.getshow():"";

         });

        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });


        $scope.getCase=function(){
            $grid.initial($scope, [$window.API.ACTIVITY.ACTIVITY_LIST,"/",id,"/company/",cid,"/case"].join(""),{orderBy:"createTime"});//
        };

        /* 获取公司*/
        $scope.dialogMyModalChooseCase=function(dt){//创建dialog及数据
            $scope.dialogInfo={};
            $scope.cases=[];
            angular.element('.myModalChooseCase').modal({backdrop: 'static', keyboard: false});
            $scope.searchCase=function(dt){
                $http.get([$window.API.ACTIVITY.ACTIVITY_LIST,"/",id,"/company/",cid,"/case/query","?pageNum=1&pageSize=10&caseName=",dt].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.cases=res.data;
                    }
                });
            }
        };
        $scope.submitChooseCase=function(dt){//选取楼盘
            $scope.dialogInfo.caseId=dt[0];
            $scope.dialogInfo.caseName=dt[1];
            successMsg.make({msg:"作品已选择！"});

        };
        $scope.submitChooseCaseDialog=function(dialogInfo){
            var data=angular.copy(dialogInfo)
            if(!data.caseName){
                $scope.dialogInfo.errorText="请选择作品！";
                return false
            }
            delete data.caseName;
            delete data.errorText;

            $http.post([$window.API.ACTIVITY.ACTIVITY_LIST,"/",id,"/company/",cid,"/case"].join(""),data).success(function(res){
                if(res.stateCode===0){
                    successMsg.make({msg:"添加成功！"});
                    $scope.getCase();
                    angular.element('.myModalChooseCase').modal('hide');
                }else{
                    errorMsg.make({msg:res.message});
                }
            });

        }

        /*删除*/
        $scope.del=function(did){
            if(confirm("移除后该作品将不再此活动展示，是否仍要移除该活动？")){
                $http({ url:[$window.API.ACTIVITY.ACTIVITY_LIST,"/",id,"/company/",cid,"/case/",did].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        successMsg.make({msg:"移除成功！"});
                        $scope.getCase();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.getCase();
                    }

                });
            }
        };

        /*详情*/
        $scope.show=function(id){
            $window.location.href = ["/#/main/case-info?id=", id].join("");
        };
        /*评论*/
        $scope.commentAudit = function(id, status) {
            if (status) {
                window.location.href = ["/#/main/case-comment?id=", id,"&status=0"].join("");
            }
            else {
                window.location.href = ["/#/main/case-comment?id=", id].join("");
            }
        };

        /***公司宣传***/
        var upPhotosBtn=angular.element("#upPhotosBtn").nextAll(".img-show-box");
        $scope.getshow=function(){
            $http.get([$window.API.ACTIVITY.ACTIVITY_LIST,"/",id,"/company/",cid,"/population"].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.showInfo=res.data;
                    upPhotosBtn.attr("data-url",$scope.showInfo.picUrl).html(QINIU.creatDom($scope.showInfo.picUrl));

                }
            });
        }
        $scope.submitShow=function(dt){
            var data=angular.copy(dt)
            data.picUrl =upPhotosBtn.attr("data-url");
            console.log(data)

            if(!data.picUrl){
                $scope.showInfo.errorText="请上传宣传图片！";
                return false
            }
            if(!data.populationContext){
                $scope.showInfo.errorText="请填写公司宣传文本！";
                return false
            }
            $scope.showInfo.errorText="";
            delete  data.errorText;
            $http.post([$window.API.ACTIVITY.ACTIVITY_LIST,"/",id,"/company/",cid,"/population"].join(""),data).success(function(res){
                if(res.stateCode===0){
                    successMsg.make({msg:"保存成功！"});
                    angular.element('.myModalChooseCase').modal('hide');
                }else{
                    errorMsg.make({msg:res.message});
                }
            });

        }



    }])


/**
 *活动管理 > 活动列表 >活动详情(楼盘活动)-活动中奖宣传-新增/查看/修改
 */

sysController.controller("PrizePublicityController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout","$dateTool","$filter","$grid","$rootScope","$getSelectTypes",
        function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout,$dateTool,$filter,$grid,$rootScope,$getSelectTypes) {
            // 获取编辑类型
            $scope.type = get_param($window.location.href, "t")*1;
            var activityId=get_param($window.location.href, "aId")*1;//活动id
            var xId = get_param($window.location.href, "xId")*1;//中奖宣传id
            /*数据验证规则*/
            $scope.pubRegex=$validate.pubRegex.rule;

            var UEC='';//富文本数据
            /*初始化富文本编辑器*/
            var ue = UE.getEditor('editor');

            /*调用七牛上传*/
            var maxLen=1,minLen=1;
            GET_TOKEN();
            QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
            QINIU.FUN(maxLen,minLen,$scope);
            QINIU.FileUploaded();
            Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"coverImage"}));
            var coverImage=angular.element("#coverImage").nextAll(".img-show-box");

            /*富文本填写校验*/
            checkUe();
            function checkUe(){
               ue.addListener('blur',function(){
                   UEC=UE.getEditor('editor').getContent();
                   if(!UEC){
                       angular.element("#editor").addClass("err");
                       return false
                   }
                   angular.element("#editor").removeClass("err");
               });
            }

            /*获取数据*/
            if(xId&&ue){
                // 查看或修改先获取数据
                $http.get([$window.API.ACTIVITY.ACTIVITY_AWARD_PROPAGANDA,"?propagandaId=",xId].join("")).success(function(res){
                    // console.log(res)
                    if(!res.stateCode){
                        $scope.dataInfo=res.data;
                        coverImage.attr("data-url",res.data.cover).html(QINIU.creatDom(res.data.cover));
                        $timeout(function(){
                            ue.setContent(res.data.content);
                        },1000);

                    }
                })


            }
            /**
             * [提交数据]
             * @param  {[type]} dt [description]
             * @return {[type]}    [description]
             */
            var submitPass = true;
            $scope.submitPrizePublicity = function(dt){
                // dt包含 id propagandaName content cover 这4个字段
                // console.log(dt)
                var  infoData=angular.copy(dt)||{};
                infoData.activityId=activityId;
                infoData.content=ue.getContent();//富文本
                infoData.cover=coverImage.attr("data-url");//封面图片

                if(!infoData.content){
                    angular.element("#editor").addClass("err");
                }else{
                    angular.element("#editor").removeClass("err");
                }

                /*图片验证*/
                $validate.UpImgValidate({"selector":".img-show-box","bl":true});
                var nodes=angular.element(".form-control");
                nodes.blur();
                $timeout(function(){
                    var nodeErr=angular.element(".err"),
                        nodeUpErr=angular.element(".upErr"),
                        errLen=nodeErr.length;
                        upErrLen=nodeUpErr.length;
                        if(nodeErr.length!=0){
                            return false;
                        }
                    // console.log(infoData);
                    // return false;
                    if(errLen<1&&upErrLen<1&&submitPass){
                        submitPass=false;
                        $http({ url:[$window.API.ACTIVITY.ACTIVITY_AWARD_PROPAGANDA].join(""), method:"POST",data:infoData}).success(function(res){
                            if(!res.stateCode){
                                successMsg.make({msg:"提交成功！"});
                                $window.location.href = ["/#/main/activity-list-info?id=",activityId,"&tab=",2].join("");
                            }else{
                                errorMsg.make({msg:res.message});
                            }
                            submitPass=true;
                        })
                    }
                })
            }


        }])
