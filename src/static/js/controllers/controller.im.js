/**
 *
 *
 * 会话管理 > 会话列表
 */
sysController.controller("imListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$timeout","$cookieStore",
    function($scope, $http, $window,$grid,$dateTool,$filter,$timeout,$cookieStore) {
        /*列表数据*/
        $grid.initial($scope, [$window.API.IM.IM_PUB,"/all"].join(""),{orderBy:1});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*选项卡*/
        angular.element(".tab i").click(function(){
            $(this).addClass("hover").siblings().removeClass("hover").parents("ul").next().children(".tabContent li").eq($(this).index()).show().siblings().hide();
        });

        /*获取常用枚举*/
        $http.get([$window.API.IM.IM_PUB,"/enums"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.sessionStatus =res.data.sessionStatus ;//会话状态
                $scope.groupStatus =res.data.groupStatus ; //群组状态
                $scope.orderDates =res.data.orderDates ; //时间排序
            }
        });


        /*查询*/
        var postData={};
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            postData=dt;
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.createTimeStart=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.createTimeEnd=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.filtering(postData);
        };


        /*会话状态*/
        $scope.$watch('list.state',function(dt){
            if(dt!==undefined){
                postData.state=dt;
                $scope.filtering(postData);
            }
        });
        /*群组状态*/
        $scope.$watch('list.groupState',function(dt){
            if(dt!==undefined){
                postData.groupState=dt;
                $scope.filtering(postData);
            }
        });

        /*时间排序*/
        $scope.$watch('list.orderBy',function(dt){
            if(dt!==undefined){
                postData.orderBy=dt;
                $scope.filtering(postData);
            }
        });

        /*关闭会话*/
        $scope.closeChat=function(id){
            if(confirm("确定要关闭当前会话吗？")){
                $http.post([$window.API.IM.IM_PUB,"/",id,"/close"].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                });
            }
        };
        /*加入会话*/
        $scope.joinChat=function(id){
            if(confirm("确定要加入会话吗？")){
                $http.post([$window.API.IM.IM_PUB,"/",id,"/join"].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                });
            }
        };




        /*查看*/
        $scope.show=function(id,dt){
            var params=dt||{};
            params.pageNum=$scope.pagination.currentPageNum||1;
            params.pageSize=$scope.pageSize;
            params.isAsc=false;

            function setQuery(params){ //序列化
                var str="";
                for( var k in params){
                    str+="&"+k+"="+params[k]||'';
                }
                return  str;
            }
            $cookieStore.put("chatInfoParams",setQuery(params));// 设置列表数据
            $window.location.href = ["#/main/im-list-info?id=", id].join("");
        };
    }]);

/**
 *
 *
 * 会话管理 > 会话列表 > 会话详情
 */
sysController.controller("imListInfoController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$timeout","$cookieStore",
    function($scope, $http, $window,$grid,$dateTool,$filter,$timeout,$cookieStore) {

        /*初始化数据*/
        var id=get_param($window.location.href, "id");
        $scope.id=id;
        $scope.dataInfo={};
        $scope.chatInfoParams=$cookieStore.get("chatInfoParams");
        window.nimCacheTemp={};
        var MSG;
        var MSG_BJ;
        window.isMine=true;
        /*初始化IM*/
        imCallback.IMToken=$cookieStore.get("im_token");//IMToken
        SDK_IM(imCallback);




        /*初始化表情包*/
        var emojiConfig = {
            'emojiList': emojiList,  //普通表情
             'pinupList': {},  //贴图
            'width': 500,
            'height': 300,
            'imgpath': './static/libs/NIM_Web_SDK_v4.2.0/images/',
            'callback': function (result) {
                if (!!result) {
                    // 表情，内容直接加到输入框
                    console.log(result)
                    $scope.dataInfo.messageValue= ($scope.dataInfo.messageValue||"")+result.emoji;
                    $scope.$apply();//更新执行绑定
                }
            }
        };
        new CEmojiEngine($('#emojiTag')[0], emojiConfig);

        /*选项卡*/
        angular.element(".tab i").click(function(){
            $(this).addClass("hover").siblings().removeClass("hover").parents("ul").next().children(".tabContent li").eq($(this).index()).show().siblings().hide();
        });

        /*获取常用枚举*/
        $http.get([$window.API.IM.IM_PUB,"/enums"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.sessionStatus =res.data.sessionStatus ;//会话状态
                $scope.groupStatus =res.data.groupStatus ; //群组状态
            }
        });


        /*获取群组列表*/
        $scope.getChatList=function(){
            $http.get([$window.API.IM.IM_PUB,"/all?", $scope.chatInfoParams].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.getChatListGrid =res.data ;
                }else{
                    errorMsg.make({msg:res.message});
                }
            });

        };
        //初始群组列表
        $scope.getChatList();

        /*查询指定群组基本信息*/
        $scope.getChatListInfoBase=function(id,callBack){
            $http.get([$window.API.IM.IM_PUB,"/sessionInfo?sessionId=",id].join("")).success(function(res){
                if(res.stateCode===0) {
                    $scope.getChatListInfoData = res.data;//获取当前群信息;
                    callBack&&callBack(res);//执行会话
                }else{
                    errorMsg.make({msg:res.message});
                }
            });

        };

        /*获取指定群组的信息和会话内容,如ID=100的数据*/
        $scope.getChatListInfo=function(id){
            $scope.id=id;
            $scope.getChatListInfoBase(id,callbackSession);

            //会话回调
            function callbackSession(res){
                var curObj=res.data;
                /*切换时始终需要关闭历史记录/当前消息记录*/
                $scope.closeHistory();
                $scope.closeChatContent();

                if(curObj.state===0){ //*******当前场景已解散
                    console.log("已关闭");
                    $(".radius5px").html("当前会话已关闭（解散）！");
                    return false
                }

                /*更新实例*/
                var isBeforeJoin=!!curObj["imToken"];
                isBeforeJoin?(MSG_BJ=new YX({id:curObj.groupId,bjContent:true})):(MSG=new YX({id:curObj.groupId}));
                window.isMine=true;
                //window.isMine?getTeamMembers(curObj['groupId']):'';//缓存群成员名片
                if(isBeforeJoin){
                    console.log("未加入");
                    window.isMine=false;
                    getNimTemp(curObj['imUid'],curObj['imToken'],onSyncDones);//如果未加入 获取一个临时账户
                    function onSyncDones(){
                       // getTeamMembers(curObj['groupId'],callB);
                        callB()
                    }
                    function callB(){
                        MSG_BJ.contentCurMsgHistoryInfo_BG_ClS(curObj.groupId&&("team-"+curObj.groupId),nimCacheTemp,nimTemp)
                        MSG_BJ.cloudMsg(nimTemp,true);//加载更多相关方法
                    }
                    !!nimCacheTemp? onSyncDones():'';//  如果已经同步 则直接运行

                //}else if(curObj.state===0&&!(curObj["imToken"])){ //*******当前场景已解散则不执行
                //    console.log("已关闭，已经加入");
                //    MSG.contentCurMsgHistoryInfo_BG_ClS(curObj.groupId&&("team-"+curObj.groupId),nimCache,nim);
                //    MSG.cloudMsg(nim,true)

                }else{
                    console.log("未关闭，已经加入");
                    MSG.contentCurMsgHistoryInfo(curObj.groupId&&("team-"+curObj.groupId)||'team-149368963',nimCache,nim); //查看当前会话前20条消息
                }
            }

        };






        /*关闭详情，返回到列表*/
        $scope.imClose=function(){
            if(confirm("确定要关闭会话详情?")){
                $window.location.href = ["#/main/im-list"].join("");
            }

        };


        /*设置会话状态/正常，风险，重要*/
        $scope.chatTag=function(code,id){
            if(confirm("确定要设置当前会话为“"+(code==0?'正常':code==2?"风险":code==1?"重要":"")+"”？")){
                $http.post([$window.API.IM.IM_PUB,"/",id,"/mark?groupState=",code].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:"操作成功!"});
                        $scope.getChatListInfoBase(id); //加载聊天面板基本信息
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };

        /*加入会话*/
        $scope.joinChat=function(id){
            if(confirm("确定要加入会话吗？")){
                $http.post([$window.API.IM.IM_PUB,"/",id,"/join"].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:"加入成功!"});
                        $scope.getChatListInfo(id); //聊天面板重新加载消息s
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };
        /*关闭群会话*/
        $scope.closeChat=function(id){
            if(confirm("警告：解散后，此会话将删除，不保存任何历史记录！确定要解散吗？")){
                $http.post([$window.API.IM.IM_PUB,"/",id,"/close"].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:"关闭成功!"});
                        $scope.getChatListInfo(id); //聊天面板重新加载消息
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };




        /*==========websocket 回调==========*/
        /*初始化同步完加载chatUI*/
        imCallback.finished=function(){
            console.log("=====finished");
            $scope.getChatListInfo(id);
            $scope.$apply();//更新执行绑定
        };

        /*实时更新其他消息*/
        imCallback.getOtherMsg=function(msg){
            console.log("=====otherMsg");
            MSG.contentCurMsgInfo(msg,nimCache);
        };
        /*同步群名片*/
        imCallback.teamMemberInfos=function(teamId,nim,data){
            console.log("=====teamMemberInfos");
            getTeamMembers(teamId,nim,data)
        };

        //================

        function pushMsg(msg) {//合并当前消息面板新老消息
            window.nimCache.msgs=nimCache.msgs||{};
            if (!Array.isArray(msg)) { msg = [msg]; }
            var sessionId = msg[0].sessionId;
            nimCache.msgs[sessionId]=nim.mergeMsgs(nimCache.msgs[sessionId], msg);// 合消息mergeMsgs(olds, news)
        }
        /*发送消息方法*/
        function messageTypeSend(option){
            //默认参数
            var defObj={
                scene:"team", //team,p2p
                teamInfo:{groupId:149368963},//
                textValue:"hello",
                sendType:1,
                fileType:"file", //仅文件类有效，对应的值分别为'image'、'audio'、'video'和'file', 不传默认为'file'。
                fileInput:"uploadFileDom"//仅文件类有效，
            };

            var option=$.extend(defObj,option);//合并

            function sendMsgDone(error, msg) {//发送后回调
                console.log(nimCache);
                console.log(msg);
                console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
                pushMsg(msg);
                if(!error){
                    /*执行发送*/
                    MSG.contentCurMsgInfo(msg,nimCache);
                    if(msg.type=='text'){
                        /*清除文本域,回调中绑定发生改变*/
                        $scope.$apply(function(){
                            $scope.dataInfo.messageValue=null;
                        });
                    }
                }else{
                    console.log("==失败原因：",error);
                }

            }

            switch (option.sendType){//sendType 1=>text 2=>file
                case 1: //文本
                    var msg = nim.sendText({
                        scene: option.scene,
                        to: option.teamInfo.groupId||"149368963",
                        text: option.textValue,//value
                        done: sendMsgDone
                    });
                    console.log('正在发送p2p text消息, id=' + msg.idClient);
                    pushMsg(msg);
                    break;

                case 2:// 文件类
                    nim.sendFile({
                        scene: option.scene,
                        to: option.teamInfo.groupId||"149368963",
                        type: option.fileType,
                        fileInput: option.fileInput,
                        beginupload: function(upload) {
                            // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
                            // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
                        },
                        uploadprogress: function(obj) {
                            $("#progressing").text(obj.percentage<100?("（已完成："+obj.percentageText+"）"):"");

                            console.log('文件总大小: ' + obj.total + 'bytes');
                            console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                            console.log('上传进度: ' + obj.percentage);
                            console.log('上传进度文本: ' + obj.percentageText);
                        },
                        uploaddone: function(error, file) {
                           if(error){
                               alert(error.message)
                           }
                            console.log(error);
                            console.log(file);
                            console.log('上传' + (!error?'成功':'失败'));

                        },
                        beforesend: function(msg) {
                            console.log('正在发送'+option.fileType+'消息, id=' + msg.idClient);
                            pushMsg(msg);
                        },
                        done: sendMsgDone
                    });
                    break;
            }

        }




        /*发送文本消息*/
        $scope.messageSendText=function(dt){
            if(!dt.messageValue){
                return false
            }
            messageTypeSend({teamInfo:$scope.getChatListInfoData,textValue:dt.messageValue,sendType:1}); //文本类
        };
        /*发送文本消息 CTRL+ENTER*/
        $scope.messageSendTextKeyDown=function(dt){
            var ev = window.event;
            if (ev.keyCode === 13 && ev.ctrlKey) {
                $scope.messageSendText(dt)
            } else if (ev.keyCode === 13 && !ev.ctrlKey) {
                //$scope.dataInfo.messageValue= ($scope.dataInfo.messageValue||"")+ '\r\n';
            }
        };
        /*发送文件类消息*/
        $scope.messageSendFile=function(){
            messageTypeSend({teamInfo:$scope.getChatListInfoData,sendType:2,fileType:"file"}); //文件类
        };

        /*发送表情emoji*/
        $scope.emojiSend=function(){
            $timeout(function(){angular.element(".m-emoji-wrapper").css({"display":"block"});})
        };



        /*查看历史消息*/
        $scope.showHistoryMessage=function(){
            $("#cloudMsgList").html("");
            $("#cloudMsgContainer .radius5px").html("");
            $("#imHistoryBox").show();
            MSG.showCloudMsg(nim);
            MSG.cloudMsg(nim);//加载更多相关方法
        };
        /*关闭历史记录*/
        $scope.closeHistory=function(){
            $("#imHistoryBox").hide();
            $("#cloudMsgList").html("");
            $("#cloudMsgContainer .radius5px").html("");
        };

        /*关闭聊天内容*/
        $scope.closeChatContent=function(){
            $("#chatContentList").html("").hide();
        };


        /*=================================成员管理逻辑====================================*/
        /*获取会话成员*/
        $scope.getChatMember=function(id){
            if(id){
                $http.get([$window.API.IM.IM_PUB,"/",id,"/member"].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.ChatMembers=res.data.imSessionMemberVos;
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };

        /*业主/业者查找*/
        $scope.searchCE=[];
        $scope.submitSearchCE=function(dt){
            var apiUrl=[];
            if(dt&&(typeof(dt)=='string') ){
                apiUrl=[$window.API.IM.IM_PUB,"/findCustomer?phone=",dt]
            }else if(dt&&(typeof(dt)!='string')) {
                var key=dt.type==1?"phone":dt.type==2?'name':dt.type==3?"company":"";
                apiUrl=[$window.API.IM.IM_PUB,"/findEmployee?",key,"=",dt.searshData]
            }else{
                return false
            }

            $http.get(apiUrl.join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.searchCE=res.data.imSessionMemberVos;
                }else{
                    errorMsg.make({msg:res.message});
                }
            });
        };



        /*添加/移除会话成员，toolType=1添加，toolType=2 移除*/
        $scope.setChatMember=function(userId,userType,toolType){

            var sessionId=$scope.getChatListInfoData.id,
                data={userId:userId,userType:userType};

            if(userId&&confirm("确定要"+(toolType==1?"添加":"删除")+"该用户吗？")){
                $http.post([$window.API.IM.IM_PUB,"/",(toolType==1?"addMember":"removeMember"),"?sessionId=",sessionId].join(""),data).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make();
                        $scope.getChatMember(sessionId);//刷新会话成员
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };



        /*打开dialog 创建会话（群）*/
        $scope.editGroup=function(dt){
            $scope.getChatMember($scope.getChatListInfoData.id);//获取默认会话成员
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };

        /*提交dialog*/
        $scope.createDialogSumbitRoot=function(dt){

            angular.element('.createDialog').modal('hide');

        };


    }]);


