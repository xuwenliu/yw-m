/**
 * coupon
 *
 *优惠券 > 优惠券列表
 */
 sysController.controller("CouponListController", ["$scope", "$http", "$window", "$grid",
    function ($scope, $http, $window, $grid) {

        $grid.initial($scope, [$window.API.COUPON.COUPON_LIST].join(""),{orderBy:"createTime"});//


        /*获取优惠券类别枚举*/
        $http.get([$window.API.COUPON.COUPON_LIST,"/couponCategory"].join("")).success(function(res){
            // console.log(res)
            if(res.stateCode===0){
                $scope.couponClass = res.data;//报错优惠券类别
            }
        });

        function getCoupon(code) {
            $http.get([$window.API.COUPON.COUPON_TYPES,"?couponCategory=",code].join("")).success(function(res){
                // console.log(res)
                if(res.stateCode===0){
                    $scope.couponTypes=res.data;//优惠券类型定义
                }
            });
        }


        $scope.$watch("dataInfo.couponClass",function(code){
            if(code){
                getCoupon(code);
            }else {
                $scope.couponTypes=[];
            }
        })
        /*查询*/
        $scope.searchSubmit=function(dt){
            $scope.filtering({couponType:dt,orderBy:"createTime"});
        };

        // 查看
        $scope.show = function(id,type) {
            $window.location.href = ["#/main/coupon-list-info?id=", id,"&type=",type].join("");
        };

        /*删除*/
        $scope.del=function(id){
            if(confirm("确定要删除该优惠券吗？")){
                $http({ url:[$window.API.COUPON.COUPON_DEL,"/",id,"/disable"].join(""), method:'post'} ).success(function(res){
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
 *优惠券 > 优惠券列表> 添加优惠券
 */

sysController.controller("CouponListAddController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout","$dateTool","$filter","$grid","$rootScope",
    function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout,$dateTool,$filter,$grid,$rootScope) {


        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};

        /*获取优惠券类别枚举*/
        $http.get([$window.API.COUPON.COUPON_LIST,"/couponCategory"].join("")).success(function(res){
            // console.log(res)
            if(res.stateCode===0){
                $scope.couponClass = res.data;//报错优惠券类别
            }
        });

        /*获取具体优惠券枚举*/
        function getCoupon(code) {
            $http.get([$window.API.COUPON.COUPON_TYPES,"?couponCategory=",code].join("")).success(function(res){
                // console.log(res)
                if(res.stateCode===0){
                    $scope.couponTypes=res.data;//优惠券类型定义
                }
            });
        }


        $scope.$watch("dataInfo.couponClass",function(code){
            if(code){
                getCoupon(code);
            }else {
                $scope.couponTypes=[];
            }

        })
        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*填写则必验证*/
        $scope.validateFun=$validate.validatePriceInt;

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});



        /**
         * 提交模块
         * **/
        var submitPass=true;//防阻塞
        $scope.submit=function(dt){

            var  infoData=angular.copy(dt[0]);
            if(infoData.type!==4&&infoData.type!==5){

                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true,right:infoData.type!=3?false:true});// 时间判断
                console.log((infoData.countDown)||0)
                $scope.isDateSubtract=(infoData.countDown||0)*1<=($dateTool.dateSubtract<0?0:$dateTool.dateSubtract)/3600/1000/24?'':"倒计时天数不能超过有效期天数";

                infoData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                infoData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');


            }

            infoData.type!==3? delete infoData.whetherCharge :"";

            console.log($dateTool.dateSubtract)
            infoData.whetherCharge===false? delete infoData.price :"";

            var  nodes=angular.element(".form-control");

            console.log(infoData)

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
                delete infoData.couponClass;//删除券的类别，服务端提交不需要该字段
                console.log("errLen:"+errLen+"|"+upErrLen);

                console.log(infoData)
                if(errLen<1&&upErrLen<1&&submitPass){
                    submitPass=false;
                    $http({ url:[$window.API.COUPON.COUPON_SAVE].join(""), method:"POST",data:infoData}).success(function(res){
                        if(!res.stateCode){
                            successMsg.make({msg:"提交成功！"});
                            $window.location.href="/#/main/coupon-list";

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
 *优惠券 > 优惠券列表> 优惠券详情
 */

sysController.controller("CouponListInfoController", ["$scope", "$http", "$window", "$cookieStore","$validate","$timeout","$filter","$grid","$rootScope",
    function($scope, $http, $window, $cookieStore, $timeout,$filter,$grid,$rootScope) {

        /*初始化*/
        var id=get_param($window.location.href, "id");
        $scope.id=id;

        /*查询信息*/
       if(id){
           $http.get([$window.API.COUPON.COUPON_INFO,"/",id].join("")).success(function(res){
               if(res.stateCode===0){
                   $scope.dataInfo =res.data;
               }else{
                   errorMsg.make({msg:res.message})
               }
           });
       }


    }])
