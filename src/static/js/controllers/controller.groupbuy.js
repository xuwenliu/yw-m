/**
 * groupbuy
 *
 *拼团管理 > 拼团列表
 */
 sysController.controller("groupbuyListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {

        $grid.initial($scope, [$window.API.GROUPBUY.GROUPBUY_PUB,"/groupActivity"].join(""),{orderBy:"1"});//

        /*查询*/
        $scope.submitSearch=function(dt){
            if(dt){
                var postData=angular.copy(dt)||{};
                postData.orderBy=dt.orderBy||"1";
                $scope.filtering(postData);
            }
        };

        /*修改*/
        $scope.edit=function(id){
           $window.location.href = ["/#/main/groupbuy-list-add?id=", id].join("");
        };

        /*查看*/
        $scope.show=function(id){
            $window.location.href = ["/#/main/groupbuy-list-info?id=", id].join("");
        };


        /*全部使用*/
        $scope.doAll=function(id){
            if(confirm("确定全部使用优惠券？")){
                $http({ url:[$window.API.GROUPBUY.GROUPBUY_PUB,"/allUseByGroupActivityId?groupActivityId=",id].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }

                });
            }
        };

        /*启用/关闭*/
        $scope.isStart=function(id,state){
          if(confirm("确定要"+(state===1?"关闭":state===2?"启用":"")+"该拼团吗？")){
              var states=state===1?2:state===2?1:"";
              $http({ url:[$window.API.GROUPBUY.GROUPBUY_PUB,"/","operateGroupActivity?id=",id,"&operate=",states].join(""), method:'post'} ).success(function(res){
                  if(!res.stateCode){
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
 *拼团管理 > 添加/修改
 */
sysController.controller("groupbuyListAddController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","$timeout",
    "$validate","GET_TOKEN","QINIU","$cookieStore","QNV","$sce","$dateTool",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,$timeout,$validate,GET_TOKEN,QINIU,$cookieStore,QNV,$sce,$dateTool) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};
        id?$scope.dataInfo.id=id:"";
        $scope.getVideos=[];

        var UEC='';//富文本数据
        /*初始化富文本编辑器*/
        var ue = UE.getEditor('editor');

        if(ue){ // 特殊处理需要页内加载资源
            $(".content-box").css({"display":"block"})
        }
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
        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd hh:ii:00",minView :0});

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;



        /*枚举1*/
        function getOptions(t) {
            $http.get([window.API.GROUPBUY.GROUPBUY_PUB, "/getTicketTypes?type=",t].join("")).success(function (res) {
                if (res.stateCode === 0) {
                   t===1? $scope.ticketTypes = res.data:t===2?$scope.comfortTicketTypes=res.data:""
                } else {
                    errorMsg.make({msg: res.message});
                }
            });
        }
        getOptions(1);
        getOptions(2);


        /*调用七牛上传*/
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(1,1,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:["picUrl"]}));



        /*七牛视频上传*/
        var qiniuVideo = new QiniuJsSDK();
        GET_TOKEN({v:true});
        new QNV.FUN().defFun();
        QNV.OPTION.uptoken=$cookieStore.get("UPTOKENV");
        QNV.FileUploaded({types:1,uri:"/",scope:$scope});//uri临时
        qiniuVideo.uploader($.extend(QNV.OPTION,{browse_button: "upVideoBtn" }));


        //获取数据
        var picUrl=angular.element("#picUrl").nextAll(".img-show-box");
        function getInfo(){
            if(id){
                $http.get([window.API.GROUPBUY.GROUPBUY_PUB,"/viewGroupActivity/",id].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.dataInfo=res.data;
                        angular.element("#beginTime").val($filter('date')(res.data.startDate, 'yyyy-MM-dd HH:mm:ss'));
                        angular.element("#endTime").val( $filter('date')(res.data.overDate, 'yyyy-MM-dd HH:mm:ss'));
                        picUrl.attr("data-url",$scope.dataInfo.picUrl).html(QINIU.creatDom($scope.dataInfo.picUrl));

                        res.data.video?$scope.getVideos[0]=res.data.video:"";

                        $timeout(function(){
                            ue.setContent(res.data.description||'');
                        },1000);
                    }else{
                        errorMsg.make({msg: res.message});
                    }
                });

            }
        }
        getInfo()


        /**
         *createVideos
         *
         * */

        function createVideoModel(){
            var selector=angular.element(".video-list-content");
            //创建上传视频模态
            this.createVideoDialog=function(){
                var that=this;
                $scope.createVideoDialog=function(dt){
                    var index=dt['index'];
                    var data=dt['addData'];
                    $scope.maxlength=dt['maxLen'];
                    $timeout(function(){
                        $scope.maxlengtherr=dt['lastData']&&dt['lastData'].length>=dt['maxLen'];
                        angular.element('.upVideoDialog').modal({backdrop: 'static', keyboard: false});
                        $scope.createVideoTitleAdd=index>=0?false:true;
                    });
                    $scope.createVideoInfo=angular.copy(dt['addData']); //注意 = 与 copy()区别，后者仅仅是复制数据
                    $scope.createVideoShowPics=null;
                    selector.attr("data-vurl",data.url).html( data.url?QNV.creatVideoNode(data.url):"");
                    that.createVideos(dt['lastData'],index)
                };
            };
            //添加到前端列表
            this.createVideos=function(ele,index){
                $scope.createVideoSumbit=function(dt){
                    var data=dt;
                    var dataArr=ele?ele:[];
                    var attr=selector.attr("data-vurl");
                    $scope.createVideoInfo.url=attr;


                    if(!data.name){
                        $scope.createVideoInfo.errorMsg="名称30字符内，不能为纯数字！";
                        return false
                    }
                    if(!data.url){
                        $scope.createVideoInfo.errorMsg="请上传视频！";
                        return false
                    }
                    if(!data.second){
                        $scope.createVideoInfo.errorMsg="请设置视频缩略图时间！";
                        return false
                    }
                    if(data.second*1>data.duration*1){
                        $scope.createVideoInfo.errorMsg="视频缩略图时间不能超过视频总长 "+data.duration+" 秒！";
                        return false
                    }

                    $scope.createVideoInfo.errorMsg=null;
                    delete data.errorMsg;

                    var bl=dataArr.some(function(x){ return x==data });

                    if(!bl&&!(index>=0)){
                        dataArr.push(data);//绑定自动 ng-model
                        successMsg.make({msg:"添加成功！"});
                    }else if(index>=0){
                        dataArr.splice(index,1,data);
                        successMsg.make({msg:"修改成功！"});
                    };

                    selector.attr("data-vurl","");
                    console.log(dataArr);
                    angular.element('.upVideoDialog').modal('hide');
                    angular.element('.creatVlen').blur();
                };
            };
            /*删除列表视频*/
            this.createVideoDel=function(){
                $scope.createVideoDel=function(dt){
                    var arr=dt[0],
                        n=arr.length,
                        i=n>0?arr.indexOf(dt[1]):0;
                    arr.splice(i,1);
                }

            };
            //预览视频
            this.createVideoShow=function(){
                $scope.createVideoShow=function(dt){
                    $scope.videoShowUrl=$sce.trustAsResourceUrl(dt);
                };
            };
            //视频创建 查看缩略图
            this.createVideoShowVideoPics=function(wh) {
                $scope.createVideoShowVideoPics = function (dt) {
                    var data = dt;
                    var vframe = "?vframe/jpg/offset/" + data.second + wh;

                    $scope.createVideoShowPics = "";
                    if (!(data.second * 1 >= 0)) {
                        return false
                    }
                    if (data.second * 1 > data.duration * 1) {
                        $scope.createVideoInfo.errorMsg = "视频缩略图时间不能超过视频总长 " + data.duration + " 秒！";
                        return false
                    } else {
                        $scope.createVideoShowPics = data.url + vframe;
                    }
                    $scope.createVideoInfo.errorMsg = null;
                }
            }
        }

        var creatVideo= new createVideoModel();
        creatVideo.createVideoDialog();
        creatVideo.createVideoDel();
        creatVideo.createVideoShow();
        creatVideo.createVideoShowVideoPics("/w/240/h/140");
        //关闭视频 结束视频播放
        $timeout(function(){
            angular.element('.myModalVideo').on('hide.bs.modal', function () {
                var v=document.querySelector("#vPlayer");
                v.currentTime = 0;
                v.pause();
            })
        },2000);


        /*提交*/

        $scope.submit=function(dt){
            var nodes=angular.element(".form-control");
            nodes.blur();
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box","bl":true});
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeUpErr=angular.element(".upErr"),
                    infoData=dt[0];
                console.log(infoData);

                infoData.startDate=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd HH:mm:ss');
                infoData.overDate=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd HH:mm:ss');

                infoData.picUrl=angular.element("#picUrl").next(".img-show-box").attr("data-url");
                $scope.getVideos[0]? infoData.video=$scope.getVideos[0]:(delete infoData.video);// 视频

                infoData.description=ue.getContent();//富文本
                if(!ue.getContent()){
                    angular.element("#editor").addClass("err");
                    return false
                }else{
                    angular.element("#editor").removeClass("err");
                }

                if(nodeErr.length!=0||nodeUpErr.length!=0){
                    return false
                }
                $http({ url:[$window.API.GROUPBUY.GROUPBUY_PUB,"/addGroupActivity"].join(""), method:'POST', data:infoData}).success(function(res){
                    if(!res.stateCode){
                        id?successMsg.make({msg:"修改成功！"}):successMsg.make({msg:"添加成功！"});
                        $window.location.href='/#/main/groupbuy-list'
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            })
        }



    }])


/**
 *拼团管理> 拼团列表> 拼团详情(3TAB)
 */
sysController.controller("groupbuyInfoController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","GET_TOKEN","QINIU","$validate","$grid","$dateTool","$filter",
    function($scope, $http, $window, $cookieStore, $timeout,GET_TOKEN,QINIU,$validate,$grid,$dateTool,$filter) {

        /*初始化*/
        var id=get_param($window.location.href, "id");
        $scope.id=id;
        $scope.createUpInfo={};

        var UEC='';//富文本数据
        /*初始化富文本编辑器*/
        var ue = UE.getEditor('editor');

        if(ue){ // 特殊处理需要页内加载资源
            $(".content-box").css({"display":"block"})
        }
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

        $(".tab-btn li a").click(function(){
            var t=$(this),i=t.index();
            t.addClass("hover").siblings("a").removeClass("hover");
            $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            i==1?  TAB2():"";
            i==2?  TAB3():"";

        });

        /*查看大图*/
        $scope.showImg=function(url){ $scope.preview=url;};


        /*常用枚举*/
        $http.get([window.API.GROUPBUY.GROUPBUY_PUB,"/enums"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.sendUserType=res.data.sendUserType ;
                $scope.sendUserTypeNoc=angular.copy(res.data.sendUserType);
                $scope.sendUserTypeNoc.shift()
            }else{
                errorMsg.make({msg:res.message});
            }
        });

        /*TAB-1 查询基本信息*/
        function getInfo(){
            if(id){
                $http.get([window.API.GROUPBUY.GROUPBUY_PUB,"/getBaseInfo?id=",id].join("")).success(function(res){
                    if(!res.stateCode){
                        $scope.dataInfo=res.data;
                       $timeout(function(){
                           ue.setContent(res.data.affiche ||'');
                       },1000)
                    }
                });

            }
        }
        getInfo();
        /*TAB-1 提交公告*/
        $scope.createNotice=function(){
            var data={id:id};
            data.affiche=ue.getContent();//富文本
            if(!data.affiche){
                angular.element("#editor").addClass("err");
                return false
            }else{
                angular.element("#editor").removeClass("err");
            }

            $http.post([window.API.GROUPBUY.GROUPBUY_PUB,"/updateAffiche"].join(""),data).success(function(res){
                if(res.stateCode===0){
                    successMsg.make({msg:"发布成功！"});
                }else{
                    errorMsg.make({msg:res.message});
                }

            })
        };



        /*TAB-2 客户信息*/
        function TAB2(){
            $grid.initial($scope, [$window.API.GROUPBUY.GROUPBUY_PUB,"/getGroupInfo"].join(""),{orderBy:"createTime",groupActivityId:id});


            // 进入推客详情
            $scope.show = function(id,type) {
                $window.location.href = ["#/main/groupbuy-list-team?id=",id].join("");
            };
            //查询
            $scope.submitSearch=function(dt){
                var dt=angular.copy(dt)||{};
                dt.orderBy="createTime";
                dt.groupActivityId=id;
                $scope.filtering(dt);
            };

        }




        /*TAB-3 发展下线*/
        function TAB3(){

            // 获取列表
            $scope.noticeData={};
            function getList(){
                $http.get([window.API.GROUPBUY.GROUPBUY_PUB,"/getNoticeList?groupActivityId=",id].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.noticeList=res.data;
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
            getList()
            //发布通知
            $scope.addNotice=function(data){
                var nodes=angular.element(".form-control");
                nodes.blur();
                data.groupActivityId=id;
                if(!data.notice||(!data.mailUserType&&!data.smsUserType)){
                    return false
                }
                $http.post([window.API.GROUPBUY.GROUPBUY_PUB,"/addNotice"].join(""),data).success(function(res){
                    if(res.stateCode===0){
                        getList()
                        successMsg.make({msg:"发布成功！"});
                        $scope.noticeData={}
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }


        }


    }]);



/**
 * groupbuy
 *
 *拼团管理 > 拼团列表 > 拼团详情-团列表
 */
sysController.controller("groupbuyInfoTeamController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        //初始化
        var id=get_param($window.location.href, "id");

        $grid.initial($scope, [$window.API.GROUPBUY.GROUPBUY_PUB,"/getGroupPerson"].join(""),{orderBy:"createTime",groupId:id});//

        /*查询*/
        $scope.submitSearch=function(dt){
            if(dt){
                var postData=angular.copy(dt)||{};
                postData.orderBy="createTime";
                postData.groupId=id;
                $scope.filtering(postData);
            }
        };


        /*全部使用*/
        $scope.doAll=function(){
            if(confirm("确定全部使用拼团券？")){
                $http({ url:[$window.API.GROUPBUY.GROUPBUY_PUB,"/allUse?groupId=",id].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }

                });
            }
        };

        /*使用/恢复*/
        $scope.isStart=function(id,state){
            if(confirm("确定要"+(state===1?"恢复":state===0?"使用":"")+"该拼团券吗？")){
                var states=state===1?2:state===0?1:"";
                $http({ url:[$window.API.GROUPBUY.GROUPBUY_PUB,"/operate?id=",id,"&operation=",states].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
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
 *
 *拼团券管理 > 拼团券列表
 */
sysController.controller("groupbuyCouponController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {

        $grid.initial($scope, [$window.API.GROUPBUY.GROUPBUY_PUB,"/getAllTicket"].join(""),{orderBy:"createTime"});//

        /*查询*/
        $scope.submitSearch=function(dt){
            if(dt){
                var postData=angular.copy(dt)||{};
                postData.orderBy="createTime";
                $scope.filtering(postData);
            }
        };




        /*枚举*/
        $http.get([window.API.GROUPBUY.GROUPBUY_PUB, "/enums"].join("")).success(function (res) {
            if (res.stateCode === 0) {
                $scope.groupActivityListOrderType=res.data.groupActivityListOrderType;
                $scope.ticketState=res.data.ticketState;
            } else {
                errorMsg.make({msg: res.message});
            }
        });

        /*枚举活动*/
        $http.get([window.API.GROUPBUY.GROUPBUY_PUB, "/getActivitys"].join("")).success(function (res) {
            if (res.stateCode === 0) {
                $scope.activitys=res.data
            } else {
                errorMsg.make({msg: res.message});
            }
        });



        /*使用/恢复*/
        $scope.isStart=function(id,state){
            if(confirm("确定要"+(state===1?"恢复":state===0?"使用":"")+"该拼团券吗？")){
                var states=state===1?2:state===0?1:"";
                $http({ url:[$window.API.GROUPBUY.GROUPBUY_PUB,"/operate?id=",id,"&operation=",states].join(""), method:'post'} ).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }

                });

            }
        };


    }]);

