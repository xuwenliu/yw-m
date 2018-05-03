/**
 * other
 *
 *消息管理
 */

sysController.controller("MailController", ["$scope", "$http", "$window", "$grid","$dateTool","$filter",
    function ($scope, $http, $window, $grid,$dateTool,$filter) {

        $grid.initial($scope, [$window.API.MAIL.MAIL_LIST].join(""),{orderBy:"sendTime"});

        $scope.showType= function(type) {
            var result = null;
            switch (type) {
                case 1 :
                    result =  "普通消息";
                    break;
                case 2 :
                    result = "案例会话消息";
                    break;
                case 3 :
                    result = "预约订单消息";
                    break;
            }
            return result;
        }

        $scope.showTime = function(time) {
            return $filter('date')(time, 'yyyy-MM-dd HH:mm:ss');
        }

        /*查询*/
        var postData={};
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'.form_datetime_start input',endTime:'.form_datetime_end input',required:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            console.log(dt)
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyyMMdd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyyMMdd');
            postData.orderBy = "sendTime";
            $scope.filtering(postData);
        };

        $dateTool.ele('.form_datetime_start,.form_datetime_end');
    }
]);


/**
 * a-d
 *
 *广告管理-广告列表
 */

sysController.controller("adListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","$timeout",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,$timeout) {
        /*列表数据*/
        $grid.initial($scope, [$window.API.ADVTS.AD].join(""),{orderBy:"createTime"});

        /*修改*/
        $scope.edit=function(id){
            $window.location.href = ["#/main/a-d-list-add?id=", id].join("");
        };

        /*新增*/
        $scope.add=function(){
            $window.location.href = ["#/main/a-d-list-add"].join("");
        };


        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });


        /*删除*/
        $scope.del=function(id,bl){
            if(confirm("确定要删除当前广告？")){
                $http.post([$window.API.ADVTS.AD,"/",id,'/delete'].join("")).success(function(res){
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
 *广告管理 > 添加/修改广告
 */
sysController.controller("adListAddController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","$timeout",
    "$validate","GET_TOKEN","QINIU","$cookieStore",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,$timeout,$validate,GET_TOKEN,QINIU,$cookieStore) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};
        id?$scope.dataInfo.id=id:"";

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2,startDate: new Date()});

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*调用七牛上传*/
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(1,1,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upImages"}));



        //获取数据
        $scope.brandInfo={};
        getInfo();
        var upImages=angular.element("#upImages").next(".img-show-box");
        function getInfo(){
            if(id){
                $http.get([window.API.ADVTS.AD,"/",id,"/show"].join("")).success(function(res){
                    if(!res.stateCode){
                        $scope.dataInfo=res.data;
                        $scope.dataInfo.startDate= $filter('date')(res.data.startDate, 'yyyy-MM-dd');
                        upImages.attr("data-url",$scope.dataInfo.advertsImage).html(QINIU.creatDom($scope.dataInfo.advertsImage));
                    }
                });

            }
        }

        /*提交*/

        $scope.submit=function(dt){
            var nodes=angular.element(".form-control");
            nodes.blur();

            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true,isEqual:true,right:false});// 时间判断

            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box","bl":true});
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeUpErr=angular.element(".upErr"),
                    infoData=dt[0];


                infoData.advertsImage =angular.element("#upImages").next(".img-show-box").attr("data-url");
                infoData.startDate =$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                console.log(infoData);

                if(nodeErr.length!=0||nodeUpErr.length!=0){
                    return false
                }

                $http({ url:id?[$window.API.ADVTS.AD,"/update"].join(""):[$window.API.ADVTS.AD,"/add"].join(""), method:'POST', data:infoData}).success(function(res){
                    if(!res.stateCode){
                        id?successMsg.make({msg:"修改成功！"}):successMsg.make({msg:"添加成功！"});
                        $window.location.href='/#/main/a-d-list'
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            })
        }



    }])

