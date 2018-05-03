/**
 * order
 *
 *订单管理 > 订单列表
 */

sysController.controller("ordersListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter",
    function($scope, $http, $window,$grid,$dateTool,$filter) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.ORDERS.ORDER_LIST].join(""),{orderBy:"createTime"});

        /*获取常用枚举*/
        $http.get([$window.API.ORDERS.ORDER_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.orderTypes = res.data.orderTypes ;//订单类型
                $scope.orderPhaseTypes =res.data.orderPhaseTypes ; //订单阶段
                $scope.houseTypes =res.data.houseTypes ;//房屋类型
                $scope.orderStatusTypes =res.data.orderStatusTypes ;//订单状态

            }
        });

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };


        /*订单类型*/
        $scope.$watch('list.orderType',function(dt){
            if(dt!==undefined){
                postData.orderType=dt
                $scope.filtering(postData);
            }
        });
        /*订单状态*/
        $scope.$watch('list.orderStatus',function(dt){
            if(dt!==undefined){
                postData.orderStatus=dt;
                $scope.filtering(postData);
            }
        });

        /*订单状态*/
        $scope.$watch('list.orderPhase',function(dt){
            if(dt!==undefined){
                postData.orderPhase=dt;
                $scope.filtering(postData);
            }
        });



        /*详细*/
        $scope.show=function(id){
            $window.location.href = ["#/main/orders-list-info?id=", id].join("");
        };

    }]);



/**
 *
 *订单管理 > 监理订单列表
 */

sysController.controller("jlOrdersListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter",
    function($scope, $http, $window,$grid,$dateTool,$filter) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.ORDERS.ORDER_LIST,"/supervisorOrder"].join(""),{orderBy:"createTime"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});


        /*获取常用枚举*/
        $http.get([$window.API.ORDERS.ORDER_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.orderTypes = res.data.orderTypes ;//订单类型
                $scope.orderPhaseTypes =res.data.orderPhaseTypes ; //订单阶段
                $scope.houseTypes =res.data.houseTypes ;//房屋类型
                $scope.orderStatusTypes =res.data.orderStatusTypes ;//订单状态

            }
        });







        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };


        /*是否四方监理*/
        $scope.$watch('list.isSupport',function(dt){
            if(dt!==undefined){
                postData.isSupport=dt
                $scope.filtering(postData);
            }
        });
        /*订单状态*/
        $scope.$watch('list.orderStatus',function(dt){
            if(dt!==undefined){
                postData.orderStatus=dt;
                $scope.filtering(postData);
            }
        });





        /*详细*/
        $scope.show=function(id){
            $window.location.href = ["#/main/jl-orders-info?id=", id].join("");
        };

    }]);





/**
 *
 *订单管理 > 订单详情
 */
sysController.controller("ordersInfoController", ["$scope", "$http", "$window","$grid","$validate","$province","$city","$area","GET_TOKEN","QINIU","$cookieStore","$dateTool","$filter",
    function($scope, $http, $window,$grid,$validate,$province,$city,$area,GET_TOKEN,QINIU,$cookieStore,$dateTool,$filter) {
        /*初始化数据*/
        var id=get_param($window.location.href, "id");
        $scope.dataInfo={};
        $scope.customerInfo={};
        $scope.dialogDataInfo={};
        $scope.areaLevelDto={};
        $scope.sreason={};

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

        /*选项卡*/
        angular.element(".tab-btn a").click(function(){
            var t=$(this),
                i= t.index(),
                o=angular.element(".tab-btn-content>ul>li");
            t.addClass("hover").siblings().removeClass("hover");
            o.eq(i).show().siblings().hide();
            if(i===1){
                getBillList()
            }else if(i===2){
                getTransferList()
            }else if(i===3){
                getLogList()
            }
        });


        /*获取常用枚举*/
        $http.get([$window.API.ORDERS.ORDER_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.houseTypes =res.data.houseTypes ;//房屋类型
                $scope.payToolTypes=res.data.payToolTypes ;//打款方式

            }
        });
        /*获取区域信息*/
        $scope.getAreaInfo=function(dt){
            $scope.areaInfo={};
            if(dt){
                $http.get([$window.API.OTHER.GET_AREA,"?areaId=",dt].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.areaInfo =res.data;
                        var idArr=(res.data.idPath).split(",");
                        $scope.areaLevelDto={one:idArr[0]*1,two:idArr[1]*1,three:(idArr[2])?idArr[2]*1:null};
                        console.log($scope.areaLevelDto)
                    }
                });
            }
        };
        /*基本信息*/
        $scope.getBaseInfo=function(){
           $http.get([$window.API.ORDERS.ORDER_INFO,"/",id].join("")).success(function(res){
               if(res.stateCode===0){
                   $scope.dataInfo =res.data;
                   $scope.customerInfo =res.data.customerInfo;
                   $scope.dialogDataInfo =res.data.customerInfo;
                   $scope.getAreaInfo(res.data.customerInfo.areaId )
               }
           });
        }
        $scope.getBaseInfo();

        /*城市联动*/
        (function () {
            $province.get()
                .success(function (data) {
                    $scope.provinces=data["data"];
                })
        })();


        //城市
        $scope.$watch("areaLevelDto.one",function(data){
            console.log(data)
           // if(data){
                $city.get({id: data})
                    .success(function (data) {
                        $scope.cities = data["data"];
                    });
            //}
        });


        //区域
        $scope.$watch("areaLevelDto.two",function(data){
          //  if(data){
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
           // }
        });





        /*打开dialog*/
        $scope.createDialog=function(dt){
            $scope.dialogDataInfoE=angular.copy(dt);
            $scope.dialogDataInfoE.errorMsg=null;
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        $scope.createDialogSumbit=function(dt){
            $scope.dialogDataInfoE.errorMsg=null;
            var data=dt;
            if(!data.userName){
                $scope.dialogDataInfoE.errorMsg="姓名2-10个字符以内，不能为纯数字!";
                return false
            }
            if(!data.userPhone){
                $scope.dialogDataInfoE.errorMsg="请输入正确的手机号码!";
                return false
            }
            if(($scope.areaLevelDto.two || $scope.areaLevelDto.three)&&!$scope.areaLevelDto.one){
                $scope.dialogDataInfoE.errorMsg="请选择省或直辖市!";
                return false
            }
            if($scope.areaLevelDto.one&&!$scope.areaLevelDto.two){
                $scope.dialogDataInfoE.errorMsg="请选择城市!";
                return false
            }
            if($scope.isAreaShow==true&&$scope.areaLevelDto.two&&!$scope.areaLevelDto.three){
                $scope.dialogDataInfoE.errorMsg="请选择地区!";
                return false
            }

            if(data.houseArea&&(!((/^\d{1,8}(\.\d{1,2})?$/).test(data.houseArea))||(data.houseArea*1<=0)||(data.houseArea*1>100000))){
                $scope.dialogDataInfoE.errorMsg="面积大于0，小于等于100000,且最多2位小数!";
                return false
            }


            data.areaId=$scope.areaLevelDto.three||$scope.areaLevelDto.two||"";
            $scope.dialogDataInfoE.errorMsg=null;
            delete data.errorMsg;
            data.houseArea?data.houseArea =data.houseArea*1:"";
            if(id){
                $http({ url:[$window.API.ORDERS.ORDER_EDIT_CUSTOMER,"/",id,"/customer"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog').modal('hide');
                        $scope.getBaseInfo()
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };

        /*打开dialog 理由*/
        $scope.createDialogStop=function(){
            angular.element('.createDialog2').modal({backdrop: 'static', keyboard: false});
        };

        /*提交dialog*/
        $scope.createDialogSumbitStop=function(dt){
            var data=dt;
            if(data.closeReason.length<5){
                $scope.sreason.errorMsg="请填写理由，不少于5个字符！";
                return false
            }
            $scope.sreason.errorMsg=null;
            delete data.errorMsg;
            if(data.closeReason){
                $http({ url:[$window.API.ORDERS.ORDER_STOP,"/",id,"/status"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog2').modal('hide');
                        $scope.getBaseInfo()
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };


        /**
         * TAB2 账单
         *
         * **/



        /*付款阶段枚举*/
        $scope.getp=function(){
            $http.get([$window.API.ORDERS.ORDER_INFO,"/",id,"/UnderBillType"].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.orderPhases =res.data ; //订单阶段
                }
            });
        }




        /*订单账单信息无分页*/
        function getBillList(){
            $http.get([$window.API.ORDERS.ORDER_BILL,"/",id,"/bill"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.bill =res.data;
                }
            });
        }


        /*打开dialog 账单相关*/
        $scope.createDialogBill=function(dt){
            $scope.dialogBillType=dt[1];
            angular.element('.createDialog3').modal({backdrop: 'static', keyboard: false});
            if(dt[1]===0&&id){
                $http.get([$window.API.ORDERS.ORDER_PAYLOG,"/",id,"/",dt[0],"/journal"].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.payLog =res.data;
                    }
                });

            }

            if(dt[1]===1&&id){
                $http.get([$window.API.ORDERS.ORDER_COUPONS,"/",dt[0]].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.coupons =res.data;
                    }
                });

            }
        };


        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd hh:ii:00",minView :0,endDate: new Date()});


        /*打开dialog 补录线下账单*/
        $scope.createDialogOffLineBill=function(dt){
            $scope.getp();//获取枚举
            angular.element("#beginTime").val('');
            $scope.createDialogOffLineBillData=angular.copy(dt);
            $scope.createDialogOffLineBillData.errorMsg=null;
            $scope.createDialogOffLineBillData.payTime =$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd HH:mm:ss');

            angular.element('.createDialogOffLineBill').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ps=true;
        $scope.createDialogOffLineBillSumbit=function(dt){
            $scope.createDialogOffLineBillData.errorMsg=null;
            var data=dt;
            if(!data.payTime){
                $scope.createDialogOffLineBillData.errorMsg="请选择付款日期！";
                return false
            }
            if(!data.amount){
                $scope.createDialogOffLineBillData.errorMsg="账单金额为数字！";
                return false
            }
            if(!data.phase){
                $scope.createDialogOffLineBillData.errorMsg="请选择付款用途！";
                return false
            }



            data.orderId=id;
            $scope.createDialogOffLineBillData.errorMsg=null;
            delete data.errorMsg;
            console.log(data)
            if(id&&ps){
                ps=false;
                $http({ url:[$window.API.ORDERS.ORDER_INFO,"/addUnderBill"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialogOffLineBill').modal('hide');
                        getBillList(); // 刷新列表
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                    ps=true;
                });
            }
        };


        /**
         * TAB3 打款记录
         *
         * **/

        function getTransferList(){//获取打款记录列表
            if(!id){return false}
            $http.get([$window.API.ORDERS.ORDER_TRANSFER,"/",id,"/transfer"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.transferList =res.data;
                }
            });
        }

        function getOrderPayCount(){///查询最新金额
            if(!id){return false}
            $http.get([$window.API.ORDERS.ORDER_COUNT,"/",id,"/transfer/statistics"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.mostTransferAmount =res.data.mostTransferAmount ;
                }
            });
        }

        /*打开dialog 添加打款*/
        var select=angular.element(".img-show-box");
        $scope.createDialogPayAdd=function(dt){
            getOrderPayCount()//查询最新金额
            $scope.pay={};
            select.attr("data-url",$scope.pay.credential ).html(QINIU.creatDom($scope.pay.credential ));//删除图片
            angular.element('.createDialog4').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ispass=true;
        $scope.createDialogSumbitPay=function(dt){
            $scope.pay.credential=select.attr('data-url')?select.attr('data-url'):null;
            var data=dt;
            console.log(data)
            if(!data.transferAmount||!(data.transferAmount>0)){
                $scope.pay.errorMsg="打款金额为纯数字,最多2位小数,且不为0!";
                return false
            }

            if(data.transferAmount > $scope.mostTransferAmount){
                $scope.pay.errorMsg="打款金额不能超过最高可付金额！";
                return false
            }

            if(!data.transferTool){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.credential){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;

            if(id&&ispass){
                ispass=false;
                $http({ url:[$window.API.ORDERS.ORDER_TRANSFER,"/",id,"/transfer"].join(""), method:'post',data:data} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        getTransferList()// 刷新信息
                        angular.element('.createDialog4').modal('hide');
                        select.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };




        /**
         * TAB4 操作日志
         *
         * **/
        function getLogList(){
            if(!id){return false}
            $http.get([$window.API.ORDERS.ORDER_DO_LOG,"/",id,"/log"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.logsList =res.data;
                }
            });
        }
    }]);





/**
 *
 *  监理订单管理 > 监理订单详情
 */
sysController.controller("jlOrdersInfoController", ["$scope", "$http", "$window","$grid","$validate","$province","$city","$area","GET_TOKEN","QINIU","$cookieStore","$dateTool","$filter",
    function($scope, $http, $window,$grid,$validate,$province,$city,$area,GET_TOKEN,QINIU,$cookieStore,$dateTool,$filter) {
        /*初始化数据*/
        var id=get_param($window.location.href, "id");
        $scope.dataInfo={};
        $scope.customerInfo={};
        $scope.dialogDataInfo={};
        $scope.areaLevelDto={};
        $scope.sreason={};

        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));

        QINIU.FileUploaded({types:1,maxLen:10,minLen:1});//多图
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"xyImages",multi_selection: true}));

        QINIU.FileUploaded({types:1,maxLen:10,minLen:1});//四方监督多图
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"fourxyImages",multi_selection: true}));





        /*提交协议*/
        var xyImages=angular.element("#xyImages").nextAll(".img-show-box");
        var fourxyImages=angular.element("#fourxyImages").nextAll(".img-show-box");
        $scope.submitImages=function(){

            var data={
                "id": id,
                "supervisionContracts": xyImages.attr("data-url")?(xyImages.attr("data-url")||'').split(","):null,
                "supervisionAgreements": fourxyImages.attr("data-url")?(fourxyImages.attr("data-url")||'').split(","):null
            };
            $http.post([$window.API.ORDERS.ORDER_INFO,"/updateSupervisorOrder"].join(""),data).success(function(res){
                if(res.stateCode===0){
                    $scope.getBaseInfo();
                    successMsg.make({msg:'提交成功!'});
                }
            });

        };





        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*选项卡*/
        angular.element(".tab-btn a").click(function(){
            var t=$(this),
                i= t.index(),
                o=angular.element(".tab-btn-content>ul>li");
            t.addClass("hover").siblings().removeClass("hover");
            o.eq(i).show().siblings().hide();
            if(i===1){
                getBillList()
            }else if(i===2){
                getTransferList()
            }else if(i===3){
                getLogList()
            }
        });


        /*获取常用枚举*/
        $http.get([$window.API.ORDERS.ORDER_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.houseTypes =res.data.houseTypes ;//房屋类型
                $scope.payToolTypes=res.data.payToolTypes ;//打款方式

            }
        });
        /*获取区域信息*/
        $scope.getAreaInfo=function(dt){
            $scope.areaInfo={};
            if(dt){
                $http.get([$window.API.OTHER.GET_AREA,"?areaId=",dt].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.areaInfo =res.data;
                        var idArr=(res.data.idPath).split(",");
                        $scope.areaLevelDto={one:idArr[0]*1,two:idArr[1]*1,three:(idArr[2])?idArr[2]*1:null};
                        console.log($scope.areaLevelDto)
                    }
                });
            }
        };
        /*基本信息*/
        $scope.getBaseInfo=function(){
            $http.get([$window.API.ORDERS.ORDER_INFO,"/",id,"/supervisorOrder"].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.dataInfo =res.data;
                    $scope.customerInfo =res.data.customerInfo;
                    $scope.dialogDataInfo =res.data.customerInfo;
                    $scope.getAreaInfo(res.data.customerInfo.areaId );

                    xyImages.attr("data-url",(res.data.supervisionContracts||[]).join(",") ).html(QINIU.creatDom((res.data.supervisionContracts||[]).join(",")));
                    fourxyImages.attr("data-url",(res.data.supervisionAgreements||[]).join(",")).html(QINIU.creatDom((res.data.supervisionAgreements||[]).join(",")));

                }
            });
        }
        $scope.getBaseInfo();

        /*城市联动*/
        (function () {
            $province.get()
                .success(function (data) {
                    $scope.provinces=data["data"];
                })
        })();


        //城市
        $scope.$watch("areaLevelDto.one",function(data){
            console.log(data)
            // if(data){
            $city.get({id: data})
                .success(function (data) {
                    $scope.cities = data["data"];
                });
            //}
        });


        //区域
        $scope.$watch("areaLevelDto.two",function(data){
            //  if(data){
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
            // }
        });



        /*打开dialog*/
        $scope.createDialog=function(dt){
            $scope.dialogDataInfoE=angular.copy(dt);
            $scope.dialogDataInfoE.errorMsg=null;
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        $scope.createDialogSumbit=function(dt){
           console.log(dt)
            $scope.dialogDataInfoE.errorMsg=null;
            var data=dt;
            if(!data.userName){
                $scope.dialogDataInfoE.errorMsg="姓名2-10个字符以内，不能为纯数字!";
                return false
            }
            if(!data.userPhone){
                $scope.dialogDataInfoE.errorMsg="请输入正确的手机号码!";
                return false
            }
            if(($scope.areaLevelDto.two || $scope.areaLevelDto.three)&&!$scope.areaLevelDto.one){
                $scope.dialogDataInfoE.errorMsg="请选择省或直辖市!";
                return false
            }
            if($scope.areaLevelDto.one&&!$scope.areaLevelDto.two){
                $scope.dialogDataInfoE.errorMsg="请选择城市!";
                return false
            }
            if($scope.isAreaShow==true&&$scope.areaLevelDto.two&&!$scope.areaLevelDto.three){
                $scope.dialogDataInfoE.errorMsg="请选择地区!";
                return false
            }


            if(data.houseArea&&(!((/^\d{1,8}(\.\d{1,2})?$/).test(data.houseArea))||(data.houseArea*1<=0)||(data.houseArea*1>100000))){
                $scope.dialogDataInfoE.errorMsg="面积大于0，小于等于100000,且最多2位小数!";
                return false
            }

            data.areaId=$scope.areaLevelDto.three||$scope.areaLevelDto.two||"";
            $scope.dialogDataInfoE.errorMsg=null;
            delete data.errorMsg;
            data.houseArea?data.houseArea =data.houseArea*1:"";
            if(id){
                $http({ url:[$window.API.ORDERS.ORDER_EDIT_CUSTOMER,"/",id,"/customer"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog').modal('hide');
                        $scope.getBaseInfo()
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };

        /*打开dialog 理由*/
        $scope.createDialogStop=function(){
            angular.element('.createDialog2').modal({backdrop: 'static', keyboard: false});
        };

        /*提交dialog*/
        $scope.createDialogSumbitStop=function(dt){
            var data=dt;
            if(data.closeReason.length<5){
                $scope.sreason.errorMsg="请填写理由，不少于5个字符！";
                return false
            }
            $scope.sreason.errorMsg=null;
            delete data.errorMsg;
            if(data.closeReason){
                $http({ url:[$window.API.ORDERS.ORDER_STOP,"/",id,"/status"].join(""), method:'post',data:data} ).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog2').modal('hide');
                        $scope.getBaseInfo()
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };


        /**
         * TAB2 账单
         *
         * **/



        /*订单账单信息无分页*/
        function getBillList(){
            $http.get([$window.API.ORDERS.ORDER_BILL,"/",id,"/supervisorBill"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.bill =res.data;
                }
            });
        }


        /*打开dialog 账单相关*/
        $scope.createDialogBill=function(dt){
            $scope.dialogBillType=dt[1];
            angular.element('.createDialog3').modal({backdrop: 'static', keyboard: false});
            if(dt[1]===0&&id){
                $http.get([$window.API.ORDERS.ORDER_PAYLOG,"/",id,"/",dt[0],"/journal"].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.payLog =res.data;
                    }
                });

            }

            if(dt[1]===1&&id){
                $http.get([$window.API.ORDERS.ORDER_COUPONS,"/",dt[0]].join("")).success(function(res){
                    if(res.stateCode===0){
                        $scope.coupons =res.data;
                    }
                });

            }
        };


        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd hh:ii:00",minView :0,endDate: new Date()});


        /*打开dialog 补录线下账单*/
        $scope.createDialogOffLineBill=function(dt){
            angular.element("#beginTime").val('');
            $scope.createDialogOffLineBillData=angular.copy(dt);
            $scope.createDialogOffLineBillData.errorMsg=null;
            $scope.createDialogOffLineBillData.payTime =$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd HH:mm:ss');

            angular.element('.createDialogOffLineBill').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ps=true;
        $scope.createDialogOffLineBillSumbit=function(dt){
            $scope.createDialogOffLineBillData.errorMsg=null;
            var data=dt;
            if(!data.payTime){
                $scope.createDialogOffLineBillData.errorMsg="请选择付款日期";
                return false
            }
            if(!data.amount){
                $scope.createDialogOffLineBillData.errorMsg="账单金额为数字！";
                return false
            }
            if(!data.payTime){
                $scope.createDialogOffLineBillData.errorMsg="请选择付款日期";
                return false
            }

            data.orderId=id;
            $scope.createDialogOffLineBillData.errorMsg=null;
            delete data.errorMsg;
            if(id&&ps){
                ps=false;
                $http({ url:[$window.API.ORDERS.ORDER_INFO,"/addUnderBill"].join(""), method:'post',data:data} ).success(function(res){
                    ps=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialogOffLineBill').modal('hide');
                        getBillList(); // 刷新列表
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            }
        };




        /**
         * TAB3 打款记录
         *
         * **/

        function getTransferList(){//获取打款记录列表
            if(!id){return false}
            $http.get([$window.API.ORDERS.ORDER_TRANSFER,"/",id,"/transfer"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.transferList =res.data;
                }
            });
        }

        function getOrderPayCount(){///查询最新金额
            if(!id){return false}
            $http.get([$window.API.ORDERS.ORDER_COUNT,"/",id,"/transfer/statistics"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.mostTransferAmount =res.data.mostTransferAmount ;
                }
            });
        }

        /*打开dialog 添加打款*/
        var select=angular.element("#upPhotosBtn").nextAll(".img-show-box");
        $scope.createDialogPayAdd=function(dt){
            getOrderPayCount()//查询最新金额
            $scope.pay={};
            select.attr("data-url",$scope.pay.credential ).html(QINIU.creatDom($scope.pay.credential ));//删除图片
            angular.element('.createDialog4').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ispass=true;
        $scope.createDialogSumbitPay=function(dt){
            console.log(select.attr('data-url'))
            $scope.pay.credential=select.attr('data-url')?select.attr('data-url'):null;
            var data=dt;
            console.log(data)
            if(!data.transferAmount||!(data.transferAmount>0)){
                $scope.pay.errorMsg="打款金额为纯数字,最多2位小数,且不为0!";
                return false
            }

            if(data.transferAmount > $scope.mostTransferAmount){
                $scope.pay.errorMsg="打款金额不能超过最高可付金额！";
                return false
            }

            if(!data.transferTool){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.credential){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;

            if(id&&ispass){
                ispass=false;
                $http({ url:[$window.API.ORDERS.ORDER_TRANSFER,"/",id,"/transfer"].join(""), method:'post',data:data} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        getTransferList()// 刷新信息
                        angular.element('.createDialog4').modal('hide');
                        select.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };




        /**
         * TAB4 操作日志
         *
         * **/
        function getLogList(){
            if(!id){return false}
            $http.get([$window.API.ORDERS.ORDER_DO_LOG,"/",id,"/log"].join("")).success(function(res){
                if(!res.stateCode){
                    $scope.logsList =res.data;
                }
            });
        }
    }]);





