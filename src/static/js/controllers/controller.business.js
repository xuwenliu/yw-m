/**
 * Created by rhd on 2016/5/30
 *
 *商户管理 > 商户列表
 */
sysController.controller("BusinessListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        $scope.opts=[{name:'已完善公司信息',val:true},{name:'未完善公司信息',val:false}];

        var id=get_param($window.location.href, "id");
            isComplete=!get_param($window.location.href, "isComplete")||get_param($window.location.href, "isComplete")==1?true:false;

        var postData={
            companyName:"",
            isComplete:isComplete
        };

        $scope.isComplete=isComplete;

        $grid.initial($scope, $window.API.COMPANY.COMPANY_LIST,{"isComplete":isComplete,"companyName":""});

        $scope.submitSearch=function(dt){
            postData.companyName=dt;
            $scope.filtering(postData);
        };

        $scope.isStatus=function(dt){
            postData.isComplete=dt;
            $scope.filtering(postData);
        };

        $scope.$watch("list.supportedSupervisor",function(dt){
            console.log(dt)
            if(dt!==undefined){
                postData.supportedSupervisor=dt;
                $scope.filtering(postData);
            }

        });

        //启用||禁用
        $scope.isAvailable=function(dt){
            if(confirm(!dt[0]?"确定要启用该公司吗？":"确定要禁用该公司吗？")){
                $http({ url:[$window.API.COMPANY.COMPANY_SWITCH_AVAILABLE,dt[1],"/switchAvailable"].join(""), method:'put', data:{available:!dt[0]} }).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }
                })
            }
        };

        //删除数据
        $scope.del=function(dt){
            if(confirm("确定删除该条数据？")){
                $http({ url:[$window.API.COMPANY.COMPANY_LIST_DEL,dt,"/delete"].join(""), method:'post' }).success(function(){
                    $scope.refresh();
                })
            }
        };

        //完善||修改
        $scope.edit=function(dt){
            $window.location.href=["#/main/business-add","?id=",dt[1],"&isComplete=",dt[0]].join("")
        };

        //点击查看
        $scope.show = function(id) {
            $http.get([$window.API.COMPANY.COMPANY_GET_INFO, id].join("")).success(function(res){

                $scope.dialog = res.data;

                $scope.dialog.idHoldImage = [$scope.dialog.idHoldImage, window.IMG60x60].join("");
                $scope.dialog.idImageA = [$scope.dialog.idImageA, window.IMG60x60].join("");

            });
        };

        $scope.reset = function(id, name) {
          if (confirm("你确认要将" + name + "的账户密码重置为ywmj123456吗？")) {
            $http({
              url: [$window.API.COMPANY.COMPANY_MANAGER_RESET, id].join(""),
              method: 'post'
            }).success(function(res) {
              if (!res.codeState) {
                successMsg.make({msg:"重置成功！"});
              }
            });
          }
        };

    }]);



/**
*商户管理 > 商户列表 > 商户所属作品列表
*/

sysController.controller("BusinessCaseIncListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        var id=get_param($window.location.href, "id");
        $grid.initial($scope, [$window.API.COMPANY.COMPANY_CASEINC_LIST,id,"/list"].join(""),{orderBy:''} );
    
        //tab标签高亮
        $(".tab-btn a").eq(5).addClass("hover").siblings().removeClass("hover");
    }]);

/**
 *商户管理 > 商户列表 > 商户所属作品列表 > 作品所属从业者列表
 */

sysController.controller("BusinessStaffListByCaseController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        var id=get_param($window.location.href, "id");
        $grid.initial($scope, [$window.API.COMPANY.COMPANY_CASE_EMPLOYEE_LIST,id,"/employeeListByCase"].join("") );

        //点击查看
        $scope.show = function(id) {
            $http.get([$window.API.EMPLOYEE.EMPLOYEE_INOF, id].join("")).success(function(res){
                $scope.dialog = res;
                $scope.dialog.idHoldImage = [$scope.dialog.idHoldImage, window.IMG60x60].join("");
            });
        }
    }]);



/**
 *商户管理 > 商户列表 > 商户所属从业者
 */

sysController.controller("BusinessStaffListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        var id=get_param($window.location.href, "id");
        $grid.initial($scope, [$window.API.COMPANY.COMPANY_STAFFINC_LIST,id,"/employees"].join(""));

        //tab标签高亮
        $(".tab-btn a").eq(4).addClass("hover").siblings().removeClass("hover");

        //点击查看
        $scope.show = function(id) {
            $http.get([$window.API.EMPLOYEE.EMPLOYEE_INOF, id].join("")).success(function(res){

                $scope.dialog = res.data;

                var type = $scope.dialog.userDetailTypeStr;
                switch(type) {
                    case 1 :
                        $scope.dialog.userDetailTypeStr = "设计师";
                        break;
                    case 2 :
                        $scope.dialog.userDetailTypeStr = "项目经理";
                        break;
                    case 3 :
                        $scope.dialog.userDetailTypeStr = "商务经理";
                        break;
                }

                angular.forEach($scope.data.lifePhotos, function(value, index, array) {
                    value = [value, window.IMG60x60].join("");
                });
            });
        }

    }]);



/**
 *商户管理 > 新增装修商户列表 > 新增/编辑装修商户
 */



sysController.controller("BusinessAddController", ["$scope", "$http", "$window", "$cookieStore","$timeout","$province","$city","$area","$validate","GET_TOKEN","QINIU",
    function ($scope, $http,$window,$cookieStore,$timeout,$province,$city,$area,$validate,GET_TOKEN,QINIU) {
        /*调用七牛上传*/
        var maxLen=10,minLen=3;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"idCardImageA"}));
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"idHoldImage"}));
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"lisenceImage"}));
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"logoImage" }));
        QINIU.FileUploaded({types:1,maxLen:maxLen,minLen:minLen});//多图
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"companyPresentImages" }));




        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        var infoData={},
            errLen,
            upErrLen,
            id=get_param($window.location.href, "id"),
            bl=true,
            isComplete=get_param($window.location.href, "isComplete"),
            nodes=angular.element(".form-control");


        //获取数据
        $scope.businessInfo={  };
        var logoImage=angular.element("#logoImage").next(".img-show-box"),
            idCardImageA=angular.element("#idCardImageA").next(".img-show-box"),
            idHoldImage=angular.element("#idHoldImage").next(".img-show-box"),
            lisenceImage=angular.element("#lisenceImage").next(".img-show-box"),
            companyPresentImages=angular.element("#companyPresentImages").next(".img-show-box");

        if(!!id){
            $http.get([window.API.COMPANY.COMPANY_GET_INFO,id].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.lisenceNoOld=res.data.lisenceNo;
                    $scope.idCardOld=res.data.idCard;
                    $scope.businessInfo=res.data;
                    $scope.businessInfo.cityId=!res.data.cityId?res.data.areaId:res.data.cityId;
                    $scope.isUserName=res.data.userName?true:false;
                    $scope.isCompany=res.data.name?true:false;

                    logoImage.attr("data-url",$scope.businessInfo.logoImage).html(QINIU.creatDom($scope.businessInfo.logoImage));
                    idCardImageA.attr("data-url",$scope.businessInfo.idCardImageA).html(QINIU.creatDom($scope.businessInfo.idCardImageA));
                    idHoldImage.attr("data-url", $scope.businessInfo.idHoldImage).html(QINIU.creatDom($scope.businessInfo.idHoldImage));
                    lisenceImage.attr("data-url",$scope.businessInfo.lisenceImage).html(QINIU.creatDom($scope.businessInfo.lisenceImage));
                    companyPresentImages.attr("data-url",$scope.businessInfo.companyPresentImages).html(QINIU.creatDom($scope.businessInfo.companyPresentImages));
              }
            });

        }

        //按钮状态
        $scope.isAdd=isComplete==1?false:true;

        //加载省
        (function () {
            $province.get()
                .success(function (data) {
                    $scope.provinces=data["data"];
                })
        })();

        //监视省变化改变市
        $scope.$watch("businessInfo.provinceId",function(data){
            if(data){
                $city.get({id: data})
                    .success(function (data) {
                        $scope.cities = data["data"];
                    });
            }
        });


        //监视市变化改变区
        $scope.$watch("businessInfo.cityId",function(data){
            if(data){
                $area.get({id: data})
                    .success(function (data) {
                        if(!data.succ){
                            $scope.isAreaShow=false;
                            $scope.businessInfo.areaId=null;
                        }else{
                            $scope.isAreaShow=true;
                        }
                        $scope.areas = data["data"];
                    });
            }

        });

        /*验证营业执照*/
        $scope.ajaxLisenceNo=function(dt){
            $validate.ajaxValidate($scope,[window.API.COMPANY.COMPANY_LISENCE_REQUIRED,"?businessLicence=",dt[0]].join(""),dt[0],dt[1],dt[2],bl,$scope.lisenceNoOld)
        }

        /*验证身份证号码*/
        $scope.ajaxidCard=function(dt){
            $validate.ajaxValidate($scope,[window.API.COMPANY.COMPANY_IDCARD_REQUIRED,"?idNumber=",dt[0]].join(""),dt[0],dt[1],dt[2],bl,$scope.idCardOld)
        }



        //修改信息
        var API=function(info){
            var url=$window.API.COMPANY.COMPANY_ADD_EDIT;
            return id ? $http({ url:[url,"/",id].join(""), method:'PUT',data:info }):$http({ url:url, method:'POST',data:info});
        };

        var isSubmit=true;//防止重复提交
        $scope.submit=function(dt){
            $scope.businessInfo.logoImage=logoImage.attr("data-url");
            $scope.businessInfo.idCardImageA=idCardImageA.attr("data-url");
            $scope.businessInfo.idHoldImage=idHoldImage.attr("data-url");
            $scope.businessInfo.lisenceImage=lisenceImage.attr("data-url");
            $scope.businessInfo.companyPresentImages=companyPresentImages.attr("data-url");
            infoData=angular.copy(dt[0]);
            isComplete==="1"?infoData.available=$scope.businessInfo.available:infoData.available=dt[1];

            /*保存/开通校验*/
            dt[1]?nodes.blur().removeClass("rmcolor"):nodes.each(function(){
                var t=$(this);
                if(!!t.val()){
                    t.removeClass("rmcolor");
                    t.blur();
                }else{
                    t.addClass("rmcolor")
                }
            });

            angular.element(".required").removeClass("rmcolor").blur();
            angular.element(".areas").blur();

            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box","bl":dt[1]});

            /*请求*/
            $timeout(function(){
               var nodeErr=angular.element(".err"),
                   nodeErrRes=angular.element(".err:not(.rmcolor)"),
                   nodeUpErr=angular.element(".upErr"),
                   required=angular.element(".required.err");

                if(!$scope.isAreaShow){
                    infoData.areaId=infoData.cityId;
                }

                dt[1]?nodeErr.first().focus():required.first().focus();

                errLen=nodeErrRes.length;
                upErrLen=nodeUpErr.length;
                dt[1]?infoData.complete=true:infoData.complete=false;

                delete  infoData['companyVideoInfo']; //服务端逻辑 前端临时修改
                delete  infoData['companyPresentImages']; //服务端逻辑 前端临时修改
                delete  infoData['presentImages']; //服务端逻辑 前端临时修改

                console.log("errLen:"+errLen+"|"+upErrLen);

                if(errLen<1&&upErrLen<1&&isSubmit){
                    isSubmit=false;
                    API(infoData).success(function(res){
                        isSubmit=true;
                        if(!res.stateCode){
                            dt[1]?successMsg.make({msg:"提交成功！"}):successMsg.make({msg:"保存成功！"});
                            dt[1]?window.location.href="#/main/business":window.location.href="#/main/business?isComplete=false";
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                    })
                }

            });
        };



    }]);



/**
 *
 *公司管理 > 公司详情
 */
sysController.controller("BusinessInfoController", ["$scope", "$http", "$window","$dateTool","$filter","$timeout",
    function($scope, $http, $window,$dateTool,$filter,$timeout) {
        //初始数据
        var id=get_param($window.location.href, "id");
        $scope.getId=id;

        /*选项卡*/
        // angular.element(".tab-btn a").click(function(){
        //     var t=$(this),
        //         i= t.index(),
        //         o=angular.element(".tab-btn-content>ul>li");
        //     t.addClass("hover").siblings().removeClass("hover");

        //     if(i==2||i==3||i==4||i==5||i==6){
        //         o.eq(2).show().siblings().hide();
        //     }else{
        //         o.not(":eq(2)").hide();
        //         o.eq(i).show();
        //     }

        // });

        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });


        /*刷新跳转*/
        // var h=($window.location.hash).split("/");
        // if(h.length>3){
        //     $window.location.href="#/main/business-info?id="+id;
        // }

    }]);

/**
 *
 *公司管理 > 公司详情-基本信息
 */
sysController.controller("BusinessBasicController", ["$scope", "$http", "$window","$dateTool","$filter","$timeout",
    function($scope, $http, $window,$dateTool,$filter,$timeout) {
        //初始数据
        var id=get_param($window.location.href, "id");
        $scope.getId=id;


        //tab标签高亮
        $(".tab-btn a").eq(0).addClass("hover").siblings().removeClass("hover");

       //获取基础数据
        if(id){
            $http.get([window.API.COMPANY.COMPANY_GET_INFO,id].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.dataInfoBase=res.data;
                }
            });

        }
        //获取账户数据，含银行卡
        if(id){
            $http.get([window.API.COMPANY.COMPANY_ACCOUNT_INFO,"/",id,"/account"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.dataInfoBank=res.data;
                }
            });
        }
    }]);

/**
 *
 *公司管理 > 公司详情-银行卡
 */
sysController.controller("BusinessBackCardController", ["$scope", "$http", "$window","$dateTool","$filter","$timeout",
    function($scope, $http, $window,$dateTool,$filter,$timeout) {
        //初始数据
        var id=get_param($window.location.href, "id");
        $scope.getId=id;


        //tab标签高亮
        $(".tab-btn a").eq(1).addClass("hover").siblings().removeClass("hover");

        //获取账户数据，含银行卡
        if(id){
            $http.get([window.API.COMPANY.COMPANY_ACCOUNT_INFO,"/",id,"/account"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.dataInfoBank=res.data;
                }
            });

        }
    }]);


/**
 *公司管理 > 公司详情 >资金明细流水
 */
sysController.controller("BusinessAccountController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$dateTool","$filter",
    function ($scope, $http, $window, $cookieStore, $timeout, $grid,$dateTool,$filter) {
        var id=get_param($window.location.href, "id");

        $grid.initial($scope, [$window.API.COMPANY.COMPANY_JOURNAL,"/",id,"/journal"].join(""),{orderBy:"createTime"});


        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end');

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'.form_datetime_start input',endTime:'.form_datetime_end input',required:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            console.log(dt)
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyyMMdd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyyMMdd');
            $scope.filtering(postData);
        };

    }]);






/**
 *公司管理 > 公司详情 >订单列表
 */
sysController.controller("BusinessOrderController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$getSelectTypes",
    function ($scope, $http, $window, $cookieStore, $timeout, $grid,$getSelectTypes) {
        var id=get_param($window.location.href, "id");

        $grid.initial($scope, [$window.API.COMPANY.COMPANY_ORDER_LIST,"/",id,"/order"].join(""),{orderBy:"createTime"});

        /* Tab标签高亮 */
        $(".tab-btn a").eq(2).addClass("hover").siblings().removeClass("hover");

        /*详细*/
        $scope.show=function(id,type){
            $window.location.href = ["#/main/orders-info?id=", id].join("");
        };

    }]);

/**
 *公司管理 > 公司详情 >账单列表
 */
sysController.controller("BusinessBillController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$getSelectTypes",
    function ($scope, $http, $window, $cookieStore, $timeout, $grid,$getSelectTypes) {
        var id=get_param($window.location.href, "id");

        /* Tab标签高亮 */
        $(".tab-btn a").eq(3).addClass("hover").siblings().removeClass("hover");

        /* 列表 */
        $grid.initial($scope, [$window.API.BILL.COMPANY_BILL_LIST,id].join(""), {"billType":""});

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
            "billType": ""
        };

        /* 账单类型筛选 */ 
        $scope.changeType=function(dt){
            postData.billType=dt;
            $scope.filtering(postData);
        };

        /* 账单内容选择 */
        $scope.$watch('list.billContentType',function(dt){
            if(dt!==undefined) {
                postData.billContentType = dt;
                $scope.filtering(postData);
            }
        });

        /*账单状态选择*/
        $scope.$watch('list.status',function(dt){
            if(dt!==undefined) {
                postData.status = dt;
                $scope.filtering(postData);
            }
        });

        $scope.submitSearch = function(dt) {
            if(dt){
                postData.billNumQueryKey = dt.billNumQueryKey;
                postData.customerNameQueryKey = dt.customerNameQueryKey;
                postData.customerPhoneQueryKey = dt.customerPhoneQueryKey;
                $scope.filtering(postData);
            }
        }

    }]);






/**
 *公司管理 > 公司详情 >退款列表
 */
sysController.controller("BusinessRefundController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$dateTool","$filter","$getSelectTypes",
    function ($scope, $http, $window, $cookieStore, $timeout, $grid,$dateTool,$filter,$getSelectTypes) {
        var id=get_param($window.location.href, "id");

        $grid.initial($scope, [$window.API.COMPANY.COMPANY_REFUND_LIST,"/",id,"/refundApply"].join(""),{orderBy:"createTime"});

        /*初始化状态下拉*/
        $getSelectTypes.select($scope,[$window.API.ORDER.ORDER_TYPES_STATUS].join(""),{"code":-1,desc:"全部"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end');


        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'.form_datetime_start input',endTime:'.form_datetime_end input',required:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            console.log(dt)
            dt.orderNum?postData.orderNum=encodeURI(dt.orderNum):postData.orderNum="";
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyyMMdd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyyMMdd');
            $scope.filtering(postData);
        };


        /*退款状态选择*/
        $scope.$watch('list.refundStatus',function(dt){
            if(dt){
                postData.status=dt==-1?"":dt;
                $scope.filtering(postData);
            }
        });



        /*详细*/
        $scope.show=function(id){
            $window.location.href = ["#/main/refund-list-info?id=", id].join("");
        };



    }]);

/**
 *公司管理 > 申请入驻列表
 */
sysController.controller("BusinessApplyListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout", "$grid", "$getSelectTypes", 
    function($scope, $http, $window, $cookieStore, $timeout, $grid, $getSelectTypes) {
        $grid.initial($scope, [$window.API.COMPANY.COMPANY_APPLY_LIST].join(""),{orderBy:"createTime"});

        // 申请状态
        $scope.showStatus = function(val) {
            var result = null;
            switch (val) {
                case 0:
                    result = "待审核";
                    break;
                case 1:
                    result = "已签约";
                    break;
                case 2:
                    result = "已拒绝";
                    break;
            }
            return result;
        }

        // 入驻详情
        $scope.show = function(id) {
            $window.location.href = ["#/main/company-apply-info?id=", id].join("");
        }

        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            dt.searchKey?postData.searchKey=dt.searchKey:postData.searchKey="";
            $scope.filtering(postData);
        };

        /*申请状态选择*/
        $scope.$watch('list.status',function(dt){
            if(dt){
                postData.status=dt==-1?"":dt;
                $scope.filtering(postData);
            }
        });
    }]);


/**
 *公司管理 > 申请入驻列表 > 申请入驻详情
 */
sysController.controller("BusinessApplyInfoController", ["$scope", "$http", "$window", "$cookieStore", "$timeout",
    function($scope, $http, $window, $cookieStore, $timeout) {
        var id=get_param($window.location.href, "id");

        $scope.dataInfo = {};

        getApplyDetail(id);

        function getApplyDetail(id) {
            // 获取入驻详情
            $http.get([$window.API.COMPANY.COMPANY_APPLY_INFO,id].join("")).success(function(res){
                if (res.succ) {
                    $scope.dataInfo = res.data;

                }
                else {
                    errorMsg.make({msg:res.message});
                }
            });
        }

        //弹出框
        $scope.bootDialog = function(s) {
            $scope.dialog = {"data":{}, "title":s.title, "status":s.status, "placeholder":s.placeholder};   
        };

        var submitPass = true;
        $scope.submit= function(dt) {
            var infoData = {};
            infoData.auditReason = dt.data.auditReason;
            if (dt.status === 1) {
                infoData.isApproval = true;
            }
            else if (dt.status === 2) {
                infoData.isApproval = false;
            }

            var  nodes=angular.element(".js-reject .form-control");
            
            if (!infoData.isApproval) {
                nodes.blur();
            }

            $timeout(function() {
                var nodeErr=angular.element(".err"),
                    nodeErrRes=angular.element(".err:not(.rmcolor)"),
                    errLen=nodeErrRes.length;
                    
                nodeErr.first().focus();

                if(errLen<1 && submitPass){
                    submitPass=false;
                    $http({ url:[$window.API.COMPANY.COMPANY_APPLY_AUDIT,id,"?isApproval=",infoData.isApproval,"&auditReason=",infoData.auditReason].join(""), method:'POST'}).success(function(res){
                        if (res.succ) {
                            successMsg.make({msg:"操作成功"});
                            angular.element('.authModal').modal('hide');
                            getApplyDetail(id);
                        }
                        else {
                            errorMsg.make({msg:res.message});
                        }
                        submitPass=true;
                    });
                }
            });
        }

    }])


/**
 *
 *公司管理 > 服务内容
 */

sysController.controller("BusinessServiceController", ["$scope", "$http", "$window","$grid", "$timeout", "$filter",
    function($scope, $http, $window, $grid, $timeout, $filter) {

        // 请求订单阶段列表
        $grid.initial($scope, [$window.API.COMPANY.COMPANY_SERVICE_PHASE].join(""),{orderBy:"createTime",isAsc:false});

        $scope.showType = function(type) {
            switch (type) {
                case 1 :
                    return "硬装设计";
                    break;
                case 2 :
                    return "软装设计";
                    break;
                case 3 :
                    return "硬装施工";
                    break;
                case 4 :
                    return "软装施工";
                    break;
            }
        }

        $scope.showTime = function(time) {
            return $filter('date')(time, 'yyyy-MM-dd HH:mm:ss');
        };

        /*订单类型选择*/
        var postData = {orderBy:"createTime"};
        $scope.$watch('list.contentType',function(dt){
            if(dt){
                postData.type=dt==-1?"":dt;
                $scope.filtering(postData);
            }
        });

        //操作模态
        $scope.bootDialog=function(arg){
            $scope.dialog={};

            if (arg.status) {
                // 修改订单阶段
                $scope.title = "服务内容";
                $scope.dialog={id:arg.dataInfo.id, name:arg.dataInfo.name, type:arg.dataInfo.type, description:arg.dataInfo.description};

            } else {
                // 新增订单阶段
                $scope.title = "新增服务内容";
                $scope.dialog={id:0};
            }
        };

        var submitPass=true;
        $scope.dialogSubmit = function(dt) {
            var infoData = angular.copy(dt);
            var  nodes=angular.element(".form-control");
            nodes.blur();
            /*请求*/
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeErrRes=angular.element(".err:not(.rmcolor)");

                nodeErr.first().focus();

                errLen=nodeErrRes.length;

                if(errLen<1&&submitPass){
                    submitPass=false;
                    if (infoData.id === 0) {
                        $http({ url:[$window.API.COMPANY.COMPANY_SERVICE_PHASE_SET].join(""), method:'POST',data:infoData}).success(function(res){
                            if (res.succ) {
                                successMsg.make({"msg":"订单阶段新增成功"});

                                angular.element('.myModal').modal('hide');
                                // 请求订单阶段列表
                                $scope.refresh();
                            }
                            else {
                                errorMsg.make({msg:res.message});
                            }
                            submitPass=true;
                        })
                    }
                    else {
                        $http({ url:[$window.API.COMPANY.COMPANY_SERVICE_PHASE_SET,"/",infoData.id].join(""), method:'POST',data:infoData}).success(function(res){
                            if (res.succ) {
                                successMsg.make({"msg":"订单阶段修改成功"});

                                angular.element('.myModal').modal('hide');
                                // 请求订单阶段列表
                                $scope.refresh();
                            }
                            else {
                                errorMsg.make({msg:res.message});
                            }
                            submitPass=true;
                        })
                    }
                }
            });
        }

    }]);




/**
 * ===================================
 *公司管理 > 监理公司列表
 */


sysController.controller("jscListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {
        /*初始数据*/
        $grid.initial($scope, [$window.API.COMPANY.JL_PUB].join(""),{orderBy:"createTime"});

        //启用||禁用
        $scope.isAvailable=function(dt){
            if(confirm(dt[0]?"启用后，前端将显示该监理公司，确定启用？":"禁用后，前端将不再显示该监理公司，确定禁用？")){
                $http({ url:[$window.API.COMPANY.JL_PUB,"/",dt[1],"/enable?enable=",dt[0]].join(""), method:'post'}).success(function(res){
                    if(!res.stateCode){
                        $scope.refresh();
                    }
                })
            }
        };
    }]);


/**
 *商户管理 > 监理公司列表 > 新增/编辑监理公司
 */

sysController.controller("jscListAddController", ["$scope", "$http", "$window", "$cookieStore","$timeout","$province","$city","$area","$validate","GET_TOKEN","QINIU",
    function ($scope, $http,$window,$cookieStore,$timeout,$province,$city,$area,$validate,GET_TOKEN,QINIU) {

        /*初始化*/
        var infoData={},
            errLen,
            upErrLen,
            id=get_param($window.location.href, "id"),
            bl=true,
            nodes=angular.element(".form-control");

        /*初始化富文本编辑器*/
        var ue = UE.getEditor('editor');
        var coverImage=angular.element("#coverImage").nextAll(".img-show-box");

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




        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=0;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"logoImage" }));

        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"licenceImage"}));

        QINIU.FileUploaded({types:1,maxLen:3,minLen:1});//多图
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"supervisorAptitudes" })); //监理资质1-3



        QINIU.FileUploaded({types:1,maxLen:10,minLen:0});
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"honors"})); // 荣誉证书 0-10


        QINIU.FileUploaded({mime:"pdf"});
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"supervisorContract"})); //合同模板PDF

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;
        /*验证非必填座机号*/
        $scope.ckTel=function(dt){
            if(dt&&(!($scope.pubRegex.tel).test(dt))){
                return true
            }else{
                false
            }
        };

        //获取数据
        $scope.businessInfo={  };
        var logoImage=angular.element("#logoImage").nextAll(".img-show-box"),// logo
            supervisorContract=angular.element("#supervisorContract").nextAll(".img-show-box"),//
            honors=angular.element("#honors").nextAll(".img-show-box"),
            licenceImage=angular.element("#licenceImage").nextAll(".img-show-box"),
            supervisorAptitudes=angular.element("#supervisorAptitudes").nextAll(".img-show-box");




        if(id && ue){
            $http.get([window.API.COMPANY.JL_PUB,"/",id].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.licenceNoOld=res.data.licenceNo;
                    $scope.idCardOld=res.data.idCard;
                    $scope.businessInfo=res.data;
                    $scope.isUserName=res.data.userName?true:false;
                    $scope.isCompany=res.data.name?true:false;
                    $scope.arid=res.data.areaId;

                    logoImage.attr("data-url",$scope.businessInfo.logoImage).html(QINIU.creatDom($scope.businessInfo.logoImage));
                    supervisorContract.attr("data-url",$scope.businessInfo.supervisorContract).html(QINIU.creatDomNoImg($scope.businessInfo.supervisorContract));
                    $scope.businessInfo.honors? honors.attr("data-url", ($scope.businessInfo.honors).join()).html(QINIU.creatDom(($scope.businessInfo.honors).join())):"";
                    licenceImage.attr("data-url",$scope.businessInfo.licenceImage).html(QINIU.creatDom($scope.businessInfo.licenceImage));
                    supervisorAptitudes.attr("data-url", ($scope.businessInfo.supervisorAptitudes).join()).html(QINIU.creatDom(($scope.businessInfo.supervisorAptitudes).join()));

                    $timeout(function(){
                        ue.setContent(res.data.companyPresent);
                    },1000);

                    $scope.getAreaInfo()
                }
            });

        }

        /*获取区域信息*/
        $scope.getAreaInfo=function(){
            if($scope.arid){
                $http.get([$window.API.OTHER.GET_AREA,"?areaId=",$scope.arid].join("")).success(function(res){
                    if(res.stateCode===0){

                        var arr=(res.data.idPath||"").split(",");
                        console.log(arr)
                        $scope.businessInfo.provinceId=arr[0]*1;
                        $scope.businessInfo.cityId=arr[1]*1;
                        $scope.businessInfo.areaId=arr[2]*1;
                    }
                });
            }
        };




        //加载省
        (function () {
            $province.get()
                .success(function (data) {
                    $scope.provinces=data["data"];
                })
        })();

        //监视省变化改变市
        $scope.$watch("businessInfo.provinceId",function(data){
            if(data){
                $city.get({id: data})
                    .success(function (data) {
                        $scope.cities = data["data"];
                    });
            }
        });


        //监视市变化改变区
        $scope.$watch("businessInfo.cityId",function(data){
            if(data){
                $area.get({id: data})
                    .success(function (data) {
                        if(!data.succ){
                            $scope.isAreaShow=false;
                            $scope.businessInfo.areaId=null;
                        }else{
                            $scope.isAreaShow=true;
                        }
                        $scope.areas = data["data"];
                    });
            }

        });

        /*验证营业执照*/
        $scope.ajaxLisenceNo=function(dt){
            $validate.ajaxValidate($scope,[window.API.COMPANY.COMPANY_LISENCE_REQUIRED,"?businessLicence=",dt[0]].join(""),dt[0],dt[1],dt[2],bl,$scope.licenceNoOld)
        }




        //修改信息
        var API=function(info){
            var url=$window.API.COMPANY.JL_PUB;
            return $http({ url:[url].join(""), method:'post',data:info })
        };

        var isSubmit=true;//防止重复提交
        $scope.submit=function(dt){
            $scope.businessInfo.logoImage=logoImage.attr("data-url");
            $scope.businessInfo.supervisorContract=supervisorContract.attr("data-url");
            $scope.businessInfo.honors=honors.attr("data-url")?(honors.attr("data-url")).split(","):null;
            $scope.businessInfo.licenceImage=licenceImage.attr("data-url");
            $scope.businessInfo.supervisorAptitudes=supervisorAptitudes.attr("data-url")?(supervisorAptitudes.attr("data-url").split(",")):null;
            infoData=angular.copy(dt[0]);

            /*保存/开通校验*/
            dt[1]?nodes.blur().removeClass("rmcolor"):nodes.each(function(){
                var t=$(this);
                if(!!t.val()){
                    t.removeClass("rmcolor");
                    t.blur();
                }else{
                    t.addClass("rmcolor")
                }
            });

            angular.element(".required").removeClass("rmcolor").blur();
            angular.element(".areas").blur();

            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box","bl":dt[1]});
            $validate.UpImgValidate({"selector":".img-show-box.pdf","bl":dt[1],msg:'请上传模板！'});

            /*请求*/
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeErrRes=angular.element(".err:not(.rmcolor)"),
                    nodeUpErr=angular.element(".upErr"),
                    required=angular.element(".required.err");

                if(!$scope.isAreaShow){
                    infoData.areaId=infoData.cityId;
                }

                delete infoData.provinceId;
                delete infoData.cityId;

                dt[1]?nodeErr.first().focus():required.first().focus();

                errLen=nodeErrRes.length;
                upErrLen=nodeUpErr.length;

                infoData.companyPresent =ue.getContent();//富文本

                console.log(infoData)
                console.log("errLen:"+errLen+"|"+upErrLen);

                if(errLen<1&&upErrLen<1&&isSubmit){
                    isSubmit=false;
                    API(infoData).success(function(res){
                        isSubmit=true;
                        if(!res.stateCode){
                            successMsg.make({msg:"提交成功！"});
                            window.location.href="/#/main/jl-company-list";
                        }else{
                            errorMsg.make({msg:res.message});
                        }
                    })
                }

            });
        };



    }]);


/**
 *
 *公司管理 > 监理公司详情
 */
sysController.controller("jscListInfoController", ["$scope", "$http", "$window","$dateTool","$filter","$timeout","$grid","$validate",
    function($scope, $http, $window,$dateTool,$filter,$timeout,$grid,$validate) {
        //初始数据
        var id=get_param($window.location.href, "id");
        $scope.getId=id;
        $scope.dialogDataInfo={};

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*查看大图*/
        var eo=$(".content-box");
        eo.on("click",".preview-img",function(){
            var url=$(this).find("img").attr("data-img");
            $timeout(function(){
                $scope.preview=url;
            })
        });


        //tab标签高亮
        $(".tab-btn a").click(function(){
            $(this).addClass("hover").siblings().removeClass("hover");
            var tc=$(this).index();
            $(".tab-content>ul>li").eq(tc).show().siblings().hide()

        })

        //获取基础数据
        if(id){
            $http.get([window.API.COMPANY.JL_PUB,"/",id].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.dataInfoBase=res.data;
                    angular.element(".html-content").html(res.data.companyPresent);
                    getAreaStr($scope.dataInfoBase.areaId)

                }
            });

        }

        //查询地区文字
        function getAreaStr(id){
            $http.get(window.API.OTHER.GET_AREA+"?areaId="+id).success(function (res) {
                if(res.stateCode===0){
                   $scope.dataInfoBase.areaStr=res.data.namePath;
                }else{
                    console.log("地区反查接口故障!")
                }

            });
        }



        /*  服务标准 列表 */
        $scope.slist=function(){
            if(id){
                $http.get([$window.API.COMPANY.JL_PUB,"/",id,"/service"].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.result=res.data;
                    }
                });
            }
        }
        $scope.slist();


        //启用||禁用
        $scope.isAvailable=function(dt){
            if(confirm(dt[0]?"启用后，前端将显示该服务模式，确定启用？":"禁用后，前端将不再显示该服务模式，确定禁用？")){
                $http({ url:[$window.API.COMPANY.JL_PUB,"/",id,"/",dt[1],"/enable?enable=",dt[0]].join(""), method:'post'}).success(function(res){
                    if(res.stateCode===0){
                        $scope.slist();
                    }
                })
            }
        };




        /*打开dialog*/
        $scope.createDialog=function(dt){

            $scope.dialogDataInfo=angular.copy(dt);
            $scope.dialogDataInfo.errorMsg=null;
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        $scope.createDialogSumbit=function(dt){
            $scope.dialogDataInfo.errorMsg=null;
            var data=dt;
            if(!data.name){
                $scope.dialogDataInfo.errorMsg="名称为4-10个字符,不能为纯数字!";
                return false
            }
            if(!data.description){
                $scope.dialogDataInfo.errorMsg="简介为8-50字符!";
                return false
            }

            if(!(typeof((data.deposit)==='number')&&(data.deposit)>=1&&(data.deposit)<=10000)){
                $scope.dialogDataInfo.errorMsg="定金为1.00~10000.00元之间!";
                return false
            }
            if(data.original){
                if(!((data.original)>=1&&(data.original)<=10000)){
                    $scope.dialogDataInfo.errorMsg="原价1.00~10000.00元之间";
                    return false
                }
            }
            if(!((data.discount)>0&&(data.discount)<=1)){
                $scope.dialogDataInfo.errorMsg="折扣比例0.01-1之间";
                return false
            }

            $scope.dialogDataInfo.errorMsg=null;
            delete data.errorMsg;

            if(id){
                $http({ url:[$window.API.COMPANY.JL_PUB,"/",id,"/service"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog').modal('hide');
                        $scope.slist();
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };
    }]);

