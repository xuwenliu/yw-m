/**
 *客户管理 > 客户列表
 */
sysController.controller("CustomerListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout", "$grid","$dateTool","$filter",
  function($scope, $http, $window, $cookieStore, $timeout, $grid,$dateTool,$filter) {
    $scope.list = {};
    $scope.list.sortKey = 0;//设置默认排序方式
    $grid.initial($scope, [$window.API.CUSTOMER.CUSTOMER_LIST].join(""),{"sortKey":$scope.list.sortKey});

    /*初始化日历*/
    $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});


    /*查询*/
    var postData={};
    postData.sortKey="createTime";
    $scope.submitSearch=function(dt){
      var postData=angular.copy(dt)||{};
      $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
      if(( $scope.dateThan)){
        return false;
      }
      postData.registerStartTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
      postData.registerEndTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
      $scope.filtering(postData);

    };

    /*用户分类*/
    $scope.$watch('list.customerType',function(dt){
      if(dt!==undefined){
        postData.customerType=dt
        $scope.filtering(postData);
      }
    });

    /*意向客户*/
    $scope.$watch('list.intention',function(dt){
      if(dt!==undefined){
        postData.intention=dt
        $scope.filtering(postData);
      }
    });

    /*是否登录过*/
    $scope.$watch('list.login',function(dt){
      if(dt!==undefined){
        postData.login=dt
        $scope.filtering(postData);
      }
    });
    /*排序方式*/
    $scope.$watch('list.sortKey',function(dt){
        console.log(dt)
        postData.sortKey=dt;
        $scope.filtering(postData);

    });


    /*获取枚举*/
    $http.get([$window.API.CUSTOMER.CUSTOMER_PUB,"/customerType"].join("")).success(function(res){
      if(!res.stateCode){
        $scope.customerTypes=res.data.customerTypes;
      }
    });


    //手机号隐藏中间4位数字
    $scope.phoneMethod = function(value) {
      value = value.substr(0, 3) + '****' + value.substr(7);
      return value;
    };

    //当名称默认为手机号时隐藏中间4位数字
    $scope.filterName = function(value) {
      var reg = /^1\d{10}$/;
      if (reg.test(value)) {
        value = value.substr(0, 3) + '****' + value.substr(7);
      }
      return value;
    };

    //注册时间
    $scope.dateMethod = function(value) {
      var regTime = new Date(value);
      var value = regTime.getFullYear()+"."+toDouble(regTime.getMonth()+1)+"."+toDouble(regTime.getDate());
      return value;
    }

    //账户禁用
    $scope.forbid = function(id, phone) {
      var str = "你确认要禁用" + phone + "的账户吗？";
      if (confirm(str)) {
        $http({
          url: [$window.API.CUSTOMER.CUSTOMER_STATUS, id, "/inActive"].join(""),
          method: 'post'
        }).success(function(res) {

          if (!res.codeState) {
            $scope.refresh();
          }

        });
      }
    };

    //账户启用
    $scope.reStart = function(id, phone) {
      var str = "你确定要启用" + phone + "的账户吗？";
      if (confirm(str)) {
        $http({
          url: [$window.API.CUSTOMER.CUSTOMER_STATUS, id, "/active"].join(""),
          method: 'post'
        }).success(function(res) {
          if (!res.codeState) {
            $scope.refresh();
          }
        });
      }
    };

    //查看详情
    $scope.bootDialog = function(id) {
      $scope.dialog = {
        submitDef: "确定",
        title: "下架说明"
      };
    }

    /**
     * [toDouble 个位数字补0]
     * @param  {[type]} iNum [description]
     * @return {[type]}      [description]
     */
    function toDouble(iNum) {
        if (iNum < 10) {
            return '0' + iNum;
        } else {
            return '' + iNum;
        }
    }


    //查看详情
    $scope.show=function(dt,tid) {
      $window.location.href=["#/main/customer-info/customer-basic","?id=",dt,"&tid=",tid].join("");

    }

    //备注
    $scope.setPlanDialog=function(dt){
      var o=angular.copy(dt);
      $scope.plan={};
      $scope.plan.customerId=o.id;
      $scope.plan.intention=o.intention;
      $scope.plan.remarks=o.remarks;
      angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
    }


    /*提交备注*/
    $scope.setPlan=function(dt){
      var data=dt;
      //if(data.remarks.length<5){
      //  $scope.plan.errorMsg="请填写备注，不少于5个字符！";
      //  return false
      //}
      $scope.plan.errorMsg=null;
      delete data.errorMsg;
      if(data.remarks||data.intention!=undefined){
        $http({ url:[$window.API.CUSTOMER.CUSTOMER_PUB,"/remarks"].join(""), method:'post',data:data} ).success(function(res){
          if(res.stateCode===0){
            successMsg.make({msg:'提交成功!'});
            angular.element('.createDialog').modal('hide');
            $scope.refresh();
          }else{
            errorMsg.make({msg:res.message});
          }

        });
      }else{
        angular.element('.createDialog').modal('hide');
      }
    };



  }
]);







/**
 *客户管理 > 客户列表 >客户详情
 */
sysController.controller("CustomerInfoController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid) {
    /*初始数据*/
    var id=get_param($window.location.href, "id");
    $scope.id=$scope.cid=id;
    var tid=get_param($window.location.href, "tid");
    $scope.twitterid=tid;

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
    //   $window.location.href="#/main/customer-info?id="+id;
    // }
    /*选项卡*/
    // angular.element(".tab-btn a").click(function(){
    //   var t=$(this),
    //       i= t.index(),
    //       o=angular.element(".tab-btn-content>ul>li");
    //   t.addClass("hover").siblings().removeClass("hover");
    //   if(i==1||i==2||i==4) {
    //     o.eq(1).show().siblings().hide();
    //   }else{
    //     o.not(":eq(1)").hide();
    //     o.eq(i==3?2:i).show();
    //   }
    // });

  }]);

/**
 *客户管理 > 客户列表 >客户详情-基本信息
 */
sysController.controller("CustomerBasicController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid) {
    /*初始数据*/
    var id=get_param($window.location.href, "id");
    $scope.id=$scope.cid=id;


    $(".tab-btn a").eq(0).addClass("hover").siblings().removeClass("hover");

    /*获取客户详情*/
    $scope.cinfo={};
    $http.get([$window.API.CUSTOMER.CUSTOMER_INFO,"/",id].join("")).success(function(res){
      if(!res.stateCode){
        $scope.cinfo=res.data;
      }
    });

  }]);

/**
 *客户管理 > 客户列表 >客户详情-房屋信息
 */
sysController.controller("CustomerHouseController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid) {
    /*初始数据*/
    var id=get_param($window.location.href, "id");
    $scope.id=$scope.cid=id;

    $(".tab-btn a").eq(3).addClass("hover").siblings().removeClass("hover");

    /*房屋信息*/
    $http.get([$window.API.CUSTOMER.CUSTOMER_HOUSE_INFO,"/",id,"/house"].join("")).success(function(res){
      if(!res.stateCode){
        $scope.result=res.data;
      }
    });
  }]);

/**
 *客户管理 > 客户列表 >资金明细流水
 */
sysController.controller("AccountFlowListController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$dateTool","$filter",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid,$dateTool,$filter) {
    var id=get_param($window.location.href, "id");

    $grid.initial($scope, [$window.API.CUSTOMER.CUSTOMER_JOURNAL,"/",id,"/journal"].join(""),{orderBy:"createTime"});


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
 *客户管理 > 客户列表 >订单列表
 */
sysController.controller("CustomerOrderListController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$getSelectTypes",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid,$getSelectTypes) {

    var id=get_param($window.location.href, "id");

    $grid.initial($scope, [$window.API.CUSTOMER.CUSTOMER_ORDER_LIST,"/",id,"/order"].join(""),{orderBy:"createTime"});

    $(".tab-btn a").eq(1).addClass("hover").siblings().removeClass("hover");
    /*详细*/
    $scope.show=function(id,type){
      $window.location.href = ["#/main/orders-info?id=", id].join("");
    };

  }]);

/**
 *客户管理 > 客户列表 >账单列表
 */
sysController.controller("CustomerBillController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$getSelectTypes",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid,$getSelectTypes) {
    var id=get_param($window.location.href, "id");

    $(".tab-btn a").eq(2).addClass("hover").siblings().removeClass("hover");

    /* 列表 */
    $grid.initial($scope, [$window.API.BILL.CUSTOMER_BILL_LIST,id].join(""), {"billType":2});

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
        if(dt!==undefined) {
            postData.status = dt;
            $scope.filtering(postData);
        }
    });

    $scope.submitSearch = function(dt) {
        if(dt){
            postData.billNumQueryKey = dt.billNumQueryKey;
            postData.companyNameQueryKey = dt.companyNameQueryKey;
            $scope.filtering(postData);
        }
    }
  }]);


/**
 *客户管理 > 客户列表 >退款列表
 */
sysController.controller("CustomerRefundListController", ["$scope", "$http", "$window", "$cookieStore","$timeout",  "$grid","$dateTool","$filter","$getSelectTypes",
  function ($scope, $http, $window, $cookieStore, $timeout, $grid,$dateTool,$filter,$getSelectTypes) {
    var id=get_param($window.location.href, "id");

    $grid.initial($scope, [$window.API.CUSTOMER.CUSTOMER_REFUND_LIST,"/",id,"/refundApply"].join(""),{orderBy:"createTime"});

    /*初始化日历*/
    $dateTool.ele('.form_datetime_start,.form_datetime_end');

    /*初始化状态下拉*/
    $getSelectTypes.select($scope,[$window.API.ORDER.ORDER_TYPES_STATUS].join(""),{"code":-1,desc:"全部"});

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
 *客户管理> 客户列表> 客户详情(节点更新)
 */
sysController.controller("CustomerStepController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","GET_TOKEN","QINIU","$validate","$dateTool",
  function($scope, $http, $window, $cookieStore, $timeout,GET_TOKEN,QINIU,$validate,$dateTool) {

    $(".tab-btn a").eq(4).addClass("hover").siblings().removeClass("hover");

    /*初始化*/
    var id=get_param($window.location.href, "tid");
    var type=get_param($window.location.href, "type")*1;
    $scope.id=id;
    $scope.type=type;
    $scope.createUpInfo={};
    $scope.dataInfo={};
    $scope.stepTypes=0

    /*数据验证规则*/
    $scope.pubRegex=$validate.pubRegex.rule;

    /*初始化日历*/
    $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

    //进展详情
    $scope.show = function(id,type) {
      $window.location.href = ["#/main/twitter-ctr-list-show?id=", id,"&type=",type].join("");
    };


    /*删除*/
    $scope.del=function(id){
      if(confirm("确定要删除该接节点吗？")){
        $http({ url:[$window.API.CUSTOMER.CUSTOMER_PUB,"/procedure/remove/",id].join(""), method:'post'} ).success(function(res){
          if(res.stateCode===0){
            getStepList()
          }else{
            errorMsg.make({msg:res.message});
            getStepList()
          }

        });
      }
    };



    /*获取常用枚举*/
    $http.get([$window.API.CUSTOMER.CUSTOMER_PUB,'/types'].join("")).success(function(res){
      if(res.stateCode===0){
        $scope.progressTypes =res.data.progressTypes;//阶段枚举
        $scope.signContentTypes =res.data.signContentTypes ; //施工类型
      }
    });




    /*节点列表*/
    getStepList()
    function getStepList(){
      $http.get([$window.API.CUSTOMER.CUSTOMER_PUB,"/",id,"/customerOtherInfo"].join("")).success(function(res){
        if(res.stateCode===0&&res.data){
          $scope.dataInfo2=res.data.basicInfoDto;
          $scope.stepLists =res.data.procedureInfoDtos;
          $scope.paysInfo =res.data.procedureCostDtos;
        }
      });
    }
    /*节点详情*/
    function getStepListInfo(stepId){
      $http.get([$window.API.CUSTOMER.CUSTOMER_PUB,"/procedure/",stepId].join("")).success(function(res){
        if(res.stateCode===0&&res.data){
          $scope.dataInfo=res.data;
          if( res.data.chatNodeInfoDto){
            $scope.stepTypes=1;
            // $scope.createUpInfo=res.data.chatNodeInfoDto
          }
          if( res.data.signNodeInfoDto){
            $scope.stepTypes=2;
            // $scope.createUpInfo=res.data.signNodeInfoDto
          }
          if( res.data.settlementInfoDto){
            $scope.stepTypes=3;
            // $scope.createUpInfo=res.data.settlementInfoDto
          }
        }
      });
    }




    /*查询节点相关*/
    function getAccountData(stepId){
      $http.get([$window.API.CUSTOMER.CUSTOMER_PUB,"/procedure/",stepId,"/signSettle"].join("")).success(function(res){
        if(res.stateCode===0&&res.data){
          $scope.signContentType=res.data.signContentType;
          $scope.signAmount =(res.data.signAmount).toFixed(2);//签约金额
          $scope.settleAmount =(res.data.settleAmount).toFixed(2);//结佣金额
          $scope.signContentCode =res.data.signContentCode ; //类型
          $scope.houseArea =res.data.houseArea ;//面积

        }
      });
    }

    /*选择公司弹窗*/
    $scope.myModalChooseCompany=function(){
      angular.element('.myModalChooseCompany').modal({backdrop: 'static', keyboard: false});
      $scope.getCompanysList=function(companyNameKey){
        $http.get([$window.API.TWITTER.TWITTER_GET_COMPANY,"?companyName=",companyNameKey].join("")).success(function(res){
          if(res.stateCode===0&&res.data){
            $scope.getCompanysList =res.data
          }
        });
      }
    };

    /*确定选择*/
    $scope.myModalChooseCompanySubmit=function(dt){
      $scope.createUpInfo.companyId=dt[0];
      $scope.dataInfo.companyName=dt[1];
      angular.element('.myModalChooseCompany').modal('hide');

    };





    /*创建信息*/
    $scope.addPayInfoDialog=function(id){
      angular.element('.upInfoDialog').modal({backdrop: 'static', keyboard: false});
      $scope.createUpInfo={};
      $scope.stepTypes=0;
      $scope.dataInfo.companyName=null;
      if(id){
        getStepListInfo(id)
        getAccountData(id)
      }
      $scope.stepId=id


    };

    /*提交弹出信息*/
    var  ispass=true;
    $scope.createUpInfoSumbit=function(dt){
      var data=dt;
      var stepId=$scope.stepId;
      data.customerTwitterId=id;
      console.log($scope.stepTypes)

      if(!data.companyId && $scope.stepTypes==0){
        $scope.createUpInfo.errorMsg="请选择公司！";
        return false
      }

      if(!data.progressType){
        $scope.createUpInfo.errorMsg="请选择节点！";
        return false
      }

      if(data.progressType==2&&!data.signContentType){
        $scope.createUpInfo.errorMsg="请选择签约类型！";
        return false
      }

      if((data.signContentType==3||data.signContentType==4||data.signContentType==5)&&!data.houseArea){
        $scope.createUpInfo.errorMsg="设置面积！";
        return false
      }

      if(data.progressType==2&&!data.signAmount){
        $scope.createUpInfo.errorMsg="填写金额,数字可保留2位小数！";
        return false
      }

      if(!data.addTime && data.progressType!==3){
        $scope.createUpInfo.errorMsg="选择日期！";
        return false
      }

      $scope.createUpInfo.errorMsg=null;
      delete data.errorMsg;

      /*如果是修改*/
      if(stepId){
        data.refreshTime=data.addTime;
        delete data.addTime;
        delete data.customerTwitterId;
        delete data.chatTime;
        delete data.companyId;
      }

      if(!ispass){return false;}
      ispass=false;

      var api=stepId?[$window.API.CUSTOMER.CUSTOMER_PUB,"/procedure/evolve/",stepId].join(""):[$window.API.CUSTOMER.CUSTOMER_PUB,"/procedure/addition"].join("");

      $http.post(api,data).success(function(res){
        ispass=true
        if(res.stateCode===0){
          angular.element('.upInfoDialog').modal('hide');
          successMsg.make({msg:res.message});
          getStepList()//刷新一次列表

        }else{
          errorMsg.make({msg:res.message})
        }

      })
    }
  }]);

/**
 *推客管理> 客户列表 >进展详情
 */
sysController.controller("TwitterListShowController", ["$scope", "$http", "$window", "$cookieStore", "$timeout", "$grid", "$getSelectTypes",
  function($scope, $http, $window, $cookieStore, $timeout, $grid, $getSelectTypes) {
    /*初始化*/
    var id=get_param($window.location.href, "id");
    $scope.dataInfo={};

    $http.get([$window.API.TWITTER.TWITTER_CUS_STEP_INFO,"/",id].join("")).success(function(res){
      if(res.stateCode===0&&res.data){
        $scope.dataInfo=res.data;
        if( res.data.chatNodeInfoDto){
          $scope.stepTypes1=1;
        }
        if( res.data.signNodeInfoDto){
          $scope.stepTypes2=2;
        }
        if( res.data.settlementInfoDto){
          $scope.stepTypes3=3;
        }
      }
    });




  }]);
