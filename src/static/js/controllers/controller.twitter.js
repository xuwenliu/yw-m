/**
 *推客管理> 申请列表v1.11.0隐藏
 */
sysController.controller("TwitterApplyListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool", "$grid", "$getSelectTypes","$filter",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool, $grid, $getSelectTypes,$filter) {

        $grid.initial($scope, [$window.API.TWITTER.TWITTER_APPLY_LIST].join(""),{orderBy:"createTime"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*进入申请详情*/
        $scope.show = function(id,type) {
            $window.location.href = ["#/main/twitter-apply-list-info?id=", id,"&s=",type].join("");
        };

        /*获取常用枚举*/
        $http.get([$window.API.TWITTER.TWITTER_ENUMS].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.applyStatus =res.data.applyStatus;//申请状态
                $scope.industryStatus =res.data.industryStatus ; //行业
            }
        });

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            dt.searchKey?postData.searchKey=dt.searchKey:postData.searchKey="";
            postData.beginDate=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endDate=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.filtering(postData);
        };


        /*申请状态选择*/
        $scope.$watch('list.applyStatus',function(dt){
            postData.applyStatus=dt==-1?"":dt;
            $scope.filtering(postData);
        });

    }]);

/**
 *推客管理> 申请列表 >申请详情v1.11.0隐藏
 */
sysController.controller("TwitterApplyListInfoController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool", "$grid", "$getSelectTypes","$filter","$validate",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool, $grid, $getSelectTypes,$filter,$validate) {

        /*初始化*/
        var id=get_param($window.location.href, "id");
        var s=get_param($window.location.href, "s");
        $scope.id=id;
        $scope.s=s;
        $scope.createUpInfo={};

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;

        /*查询信息*/
        $http.get([$window.API.TWITTER.TWITTER_APPLY_INFO,"/",id].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.inviterName=res.data.inviterName//邀请人
                $scope.dataInfo =res.data;

            }
        });



        /*查看大图*/
        $scope.showImg=function(url){ $scope.preview=url;}

        $scope.submit=function(dt){
            var data=dt;
            data.applyType=1;
            data.twitterId=$scope.dataInfo.twitterApplyInfo.twitterId;
            console.log(dt)

            console.log(data.rejectedReason)

            if(!data.rejectedReason && data.isApproval===false){
                errorMsg.make({msg:"驳回理由不能为空!"})
                return false
            }

            $http.post([$window.API.TWITTER.TWITTER_APPLY_CHECK].join(""),data).success(function(res){
                if(res.stateCode===0){
                    successMsg.make({msg:res.message});
                    $timeout(function(){
                        window.location.href="/#/main/twitter-apply-list"
                    },2000)
                }else{
                    errorMsg.make({msg:res.message})
                }
            });


        }




    }])

/**
 *推客管理> 推客团队-结佣清单
 */
sysController.controller("TwitterTeamCommissionController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool","GET_TOKEN","QINIU", "$grid", "$getSelectTypes","$filter",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool,GET_TOKEN,QINIU, $grid, $getSelectTypes,$filter) {
    	$scope.list = {};
    	/*list*/
    	//https://devconsole.yingwumeijia.com:443/twitter/team/detaliList?pageNum=1&pageSize=20
     	$grid.initial($scope, [$window.API.TWITTER.TWITTER_TEAM_DETAILLIST].join(""),{orderBy:"createTime"});

        /*初始化日历*/
     	$dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});
    	getDefailListTotal();
    	function getDefailListTotal(startTime,endTime){
    		//http://192.168.28.78:8181/twitter/team/detailList/total?startTime=2017-12-4&endTime=2017-12-5
    		$http.get([$window.API.TWITTER.TWITTER_TEAM_DETAILLIST_TOTAL,"?startTime=",startTime,"&endTime=",endTime].join("")).success(function(res){
               console.log(res.data.totalAmount)
               if(res.stateCode===0&&res.data){
                	$scope.totalAmount = res.data.totalAmount;
                }
            });
    	}

    	/*查询*/
        var postData={};
        $scope.submitSearch=function(dt){
            postData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.orderBy='createTime';
            postData.startTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.time={
            	startTime:postData.startTime,
            	endTime:postData.endTime
            }
            getDefailListTotal($scope.time.startTime,$scope.time.endTime);
            $scope.filtering(postData);
        };

   }])
/**
 *推客管理> 推客团队-团队列表
 */
sysController.controller("TwitterTeamListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool","GET_TOKEN","QINIU", "$grid", "$getSelectTypes","$filter","$validate",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool,GET_TOKEN,QINIU, $grid, $getSelectTypes,$filter,$validate) {
    	/*list*/
    	$scope.list = {};
     	$grid.initial($scope, [$window.API.TWITTER.TWITTER_TEAM].join(""),{orderBy:"createTime"});

		/*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=3;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));

		/*获取常用枚举-支付方式  */
        $http.get([$window.API.TWITTER.TWITTER_TEAM_ENUMS].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.payToolTypes=res.data;//打款方式
            }
        });

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;
        /*查看大图*/
        $scope.showImg=function(url){ $scope.preview=url;};


		/*是否存在待结佣金*/
		var postData={};
        $scope.$watch('list.isSettle',function(dt){
            postData.isSettle=dt==-1?"":dt;
            $scope.filtering(postData);
        });

    	/*团队名-查询*/
        var postData={};
        postData.orderBy='createTime';
        $scope.submitSearch=function(dt){
            postData=angular.copy(dt)||{};
            $scope.filtering(postData);
        };
        /*新增type=1/修改团队type=2*/
       	$scope.edit = function(type,teamId) {
       		if(type===2){
       			$window.location.href = ["#/main/twitter-team-list-edit?teamId=",teamId].join("");
       		}else {
       			$window.location.href = ["#/main/twitter-team-list-edit"].join("");
       		}

       	}

       	/*新增结佣记录*/

       	/*查询待结佣*/
       	$scope.pay={};
        function searchAccount(teamId){
            $http.get([$window.API.TWITTER.TWITTER_TEAM_ACCOUNT,"/",teamId].join("")).success(function(res){
                if(res.stateCode===0&&res.data){
                	$scope.pay.teamId = teamId;
                  	$scope.pay.toSettleAmount =(res.data.balance).toFixed(2);
                }
            });
        }
		/*立即结佣*/
		var selector=angular.element("#upPhotosBtn").nextAll(".img-show-box");
		$scope.atOnceAccount = function(teamId){
			searchAccount(teamId);
            selector.attr("data-url","").html("");//删除图片
            angular.element('.createDialog-atOnceAccount').modal({backdrop: 'static', keyboard: false});
		}

        /*提交dialog-立即结佣*/
        var ispass=true;
        $scope.createDialogSumbitAtOnceAccount=function(dt){
            $scope.pay.voucher=selector.attr('data-url')?selector.attr('data-url'):null;
            var data=dt;
            if(! /^\d+(\.\d{1,2})?$/.test(data.inputSettleAmount)){
                $scope.pay.errorMsg="结佣金额为纯数字，最多2位小数！";
                return false
            }
            if(data.inputSettleAmount==0){
                $scope.pay.errorMsg="结佣金额不能为0";
                return false
            }
            if((data.inputSettleAmount)*1>data.toSettleAmount*1){
                $scope.pay.errorMsg="结佣金额不能超过待结佣金额！";
                return false
            }
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;

			var postData = {
			  	"transferAmount": data.inputSettleAmount,
			  	"transferTool": data.payMode,
			  	"credential": data.voucher,
			  	"postscript": data.remark
			}
            if(!ispass){return false}
                ispass=false;
                $http({ url:[$window.API.TWITTER.TWITTER_TEAM_TRANSFERS,"/",data.teamId].join(""), method:'post',data:postData} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();
                        angular.element('.createDialog-atOnceAccount').modal('hide');
                        selector.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
        	}



       	/*查看*/
        $scope.show = function(teamId) {
            $window.location.href = ["#/main/twitter-team-list-info?teamId=", teamId].join("");
        };

        /*备注*/
		$scope.plan={};
	    $scope.setPlanDialog=function(teamId){
	    	//https://devconsole.yingwumeijia.com:443/twitter/team/123/remarks
			$http.get([$window.API.TWITTER.TWITTER_TEAM_REMARKS,"/",teamId,"/remarks"].join("")).success(function(res){
	            if(res.stateCode===0){
            		var rems = res.data?res.data.remarks:"";
	            	$scope.plan={
			    		teamId:teamId,
			    		remarks:rems
			    	}
	            }
	       });
	      	angular.element('.createDialog-remarks').modal({backdrop: 'static', keyboard: false});
	    }
		/*提交备注*/
	    $scope.setPlan=function(dt){
	      	var data=dt;
      		if(data.remarks==""||!data.remarks){
	        	$scope.plan.errorMsg="请填写备注！";
	        	return false;
	      	}
	      	$scope.plan.errorMsg=null;
	      	delete data.errorMsg;

      		//https://devconsole.yingwumeijia.com:443/twitter/team/123/remarks?remarks=555
        	$http({ url:[$window.API.TWITTER.TWITTER_TEAM_REMARKS,
        		"/",data.teamId,
        		"/remarks?remarks=",data.remarks
        	].join(""), method:'post'}).success(function(res){
	          	if(res.stateCode===0){
	            	successMsg.make({msg:'提交成功!'});
	            	angular.element('.createDialog-remarks').modal('hide');
	            	$scope.refresh();
	          	}else{
	            	errorMsg.make({msg:res.message});
	          	}
        	});
	    };

       	/*启用/禁用*/
        $scope.isAble=function(teamId,bl){
            if(confirm("确定要"+(bl?"启用":"禁用")+"该推客团队吗？")){
                $http.post([$window.API.TWITTER.TWITTER_TEAM_AVAILABLE,"/",teamId,"/available?available=",bl].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'操作成功!'});
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                })
            }
        };


   }])

/**
 *推客管理> 推客团队-团队详情
 */
sysController.controller("TwitterTeamListInfoController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool","GET_TOKEN","QINIU", "$grid", "$getSelectTypes","$filter","$validate",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool,GET_TOKEN,QINIU, $grid, $getSelectTypes,$filter,$validate) {
    	/*初始化*/
        var teamId=get_param($window.location.href, "teamId")*1;
        $scope.teamId=teamId;
        $scope.createUpInfo={};

        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=3;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));

		/*获取常用枚举*/
        $http.get([$window.API.TWITTER.TWITTER_TEAM_ENUMS].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.payToolTypes=res.data;//打款方式
            }
        });
		 /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;
        /*查看大图*/
        $scope.showImg=function(url){ $scope.preview=url;};

        $(".tab-btn li a").click(function(){
            var t=$(this),i=t.index();
                t.addClass("hover").siblings("a").removeClass("hover");
            if(i==0||i==2){
                $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            }else if(i==1){
                TAB2();
                $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            }
            else if(i==2){
                $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            }
            console.log(i)
        });


		/*=============================================================*/

        /*TAB-1 团队详情-基本信息-start*/
       	//https://devconsole.yingwumeijia.com:443/twitter/team/123/twitterTeamInfo
        $http.get([$window.API.TWITTER.TWITTER_TEAM_TWITTERTEAMINFO,"/",teamId,"/twitterTeamInfo"].join("")).success(function(res){
        	console.log(res)
            if(res.stateCode===0){
                $scope.dataInfo =res.data;
            }
        })
         /*TAB-1 团队详情-基本信息-end*/





        /*=============================================================*/
        /*TAB-2 团队详情-所属推客-start*/
        function TAB2(){
        	$scope.list={};
        	//https://devconsole.yingwumeijia.com:443/twitter/team/123/twitterTeamUserList?queryKey=hhhh&pageNum=1&pageSize=20
        	$grid.initial($scope, [$window.API.TWITTER.TWITTER_TEAM_TWITTERTEAMUSERLIST,"/",teamId,"/twitterTeamUserList"].join(""),{orderBy:"createTime"});

        	/*团队详情-所属推客-查询*/
	        var postData={};
	        postData.orderBy='createTime';
	        $scope.search=function(dt){
        		postData=angular.copy(dt)||{};
	            dt.queryKey?postData.queryKey=dt.queryKey:postData.queryKey="";
	            console.log(postData)
	            $scope.filtering(postData);
	        }
	        /*团队详情-所属推客-加入新成员*/
	       	$scope.add=function(teamId) {
	       		console.log(teamId)
	       		angular.element('.createDialog-add').modal({backdrop: 'static', keyboard: false});
	       		$scope.addNewMember=[];
	       		$scope.searchNewMember = function(queryKey) {
	       			$scope.errorMsg=null;
	                if((queryKey||"").length<2){
	                    $scope.errorMsg="至少输入2位字符";
	                    return false
	                }
	                //https://devconsole.yingwumeijia.com:443/twitter/team/relationTwitterList?queryKey=456&teamId=123
	                $http.get([window.API.TWITTER.TWITTER_TEAM_RELATIONTWITTERLIST,"?queryKey=",queryKey,"&teamId=",teamId].join("")).success(function(res){
	                    if(res.stateCode===0) {
	                        $scope.addNewMember = res.data;
	                    }
	                });
	       		}
	       	}
	       	/*团队详情-所属推客-加入新成员-确定*/
	       	/*提交dialog选择推客*/
	        var ispass=true;
	        $scope.submitAdd=function(res){
	            var ids=[];
	            angular.forEach(res,function(v,i){
	                if(v.isSelect){
	                    ids.push(v.twitterId)
	                }
	            });
	            if(ids.length==0){
	                $scope.errorMsg="你还未选择推客!";
	                return false
	            }

	            $scope.errorMsg=null;

	            if(teamId&&ispass){
	                ispass=false;
	                //https://devconsole.yingwumeijia.com:443/twitter/team/123/relationTwitter
	                $http({ url:[$window.API.TWITTER.TWITTER_TEAM_RELATIONTWITTER,"/",teamId,"/relationTwitter"].join(""), method:'post',data:{ids:ids}} ).success(function(res){
	                    ispass=true;
	                    if(res.stateCode===0){
	                        successMsg.make({msg:'提交成功!'});
	                        $scope.errorMsg=null;
	                        $scope.refresh();// 刷新信息
	                        angular.element('.createDialog-add').modal('hide');
	                    }else{
	                        errorMsg.make({msg:res.message});
	                    }

	                });
	            }
	        }
	       	/*团队详情-所属推客-加入新成员-取消*/
	       	$scope.callOffAdd = function() {
	       		angular.element('.createDialog-add').modal('hide');
	       		$scope.errorMsg=null;
	       	}
	       	/*团队详情-所属推客-查看*/
	        $scope.lookTwitterDetails = function(twitterId) {
	        	$window.location.href = ["#/main/twitter-list-info?id=", twitterId].join("");
	        }
        }
        /*TAB-2 团队详情-所属推客-end*/






        /*=============================================================*/

        /*TAB-3 团队详情-结佣记录-start*/
        /*结佣记录列表*/
        getPayList()
        function getPayList(){
        	$http.get([$window.API.TWITTER.TWITTER_TEAM_TRANSFERS,"/",teamId].join("")).success(function(res){
	            if(res.stateCode===0&&res.data){
					$scope.payLists =res.data;
	            }
	        });
        }
		/*团队详情-结佣记录-新增结佣记录*/
        /*团队详情-结佣记录-查询待结佣*/
       	$scope.pay={};
        function searchAccount(teamId){
            $http.get([$window.API.TWITTER.TWITTER_TEAM_ACCOUNT,"/",teamId].join("")).success(function(res){
                if(res.stateCode===0&&res.data){
                	$scope.pay.teamId = teamId;
                    $scope.pay.toSettleAmount =(res.data.balance).toFixed(2);
                }
            });
        }
		/*团队详情-结佣记录-新增结佣记录*/
		var selector=angular.element("#upPhotosBtn").nextAll(".img-show-box");
		$scope.atOnceAccount = function(teamId){
			searchAccount(teamId);
            selector.attr("data-url","").html("");//删除图片
            angular.element('.createDialog-atOnceAccount').modal({backdrop: 'static', keyboard: false});
		}

        /*团队详情-结佣记录-提交dialog-新增结佣记录*/
        var ispass=true;
        $scope.createDialogSumbitAtOnceAccount=function(dt){
            $scope.pay.voucher=selector.attr('data-url')?selector.attr('data-url'):null;
            var data=dt;
            if(! /^\d+(\.\d{1,2})?$/.test(data.inputSettleAmount)){
                $scope.pay.errorMsg="结佣金额为纯数字，最多2位小数！";
                return false
            }
            if(data.inputSettleAmount==0){
                $scope.pay.errorMsg="结佣金额不能为0";
                return false
            }
            if((data.inputSettleAmount)*1>data.toSettleAmount*1){
                $scope.pay.errorMsg="结佣金额不能超过待结佣金额！";
                return false
            }
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;

			var postData = {
			  	"transferAmount": data.inputSettleAmount,
			  	"transferTool": data.payMode,
			  	"credential": data.voucher,
			  	"postscript": data.remark
			}
            if(!ispass){return false}
                ispass=false;
            $http({ url:[$window.API.TWITTER.TWITTER_TEAM_TRANSFERS,"/",data.teamId].join(""), method:'post',data:postData} ).success(function(res){
                ispass=true;
                if(res.stateCode===0){
                    successMsg.make({msg:'提交成功!'});
                    getPayList();
                    angular.element('.createDialog-atOnceAccount').modal('hide');
                    selector.attr('data-url',"");
                }else{
                    errorMsg.make({msg:res.message});
                }
            });
        }
        /*TAB-3 团队详情-结佣记录-end*/

   }])

/**
 *推客管理> 推客团队-新增/修改团队
 */
sysController.controller("TwitterTeamEditController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool","GET_TOKEN","QINIU", "$grid", "$getSelectTypes","$filter","$validate","$province","$city",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool,GET_TOKEN,QINIU, $grid, $getSelectTypes,$filter,$validate,$province,$city) {
    	/*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;
    	/*初始化*/
        $scope.dataInfo = {
        	"designRatioDto":{
        		"teamRatio":0,
        		"memberRatio":0
        	},
        	"buildRatioDto":{
        		"teamRatio":0,
        		"memberRatio":0
        	}
        };

        $scope.isShowCity=true;//是否显示市
       	var mdutcgArr = [1,20,797,2252];//直辖市id 北京市，天津市，上海市，重庆市
       	/*城市联动*/
        (function () {
            $province.get()
                .success(function (data) {
                    $scope.provinces=data["data"];
                })
        })();
        //城市
        $scope.$watch("dataInfo.provinceId",function(data){
        	if(data){
        		if(mdutcgArr.indexOf(data)>-1){
	        		$scope.isShowCity=false;
	        	}else {
	        		$scope.isShowCity=true;
	        		$city.get({id: data})
	                    .success(function (data) {
	                        $scope.cities = data["data"];
	                    });
	        	}
        	}

        });
        if($window.location.href.indexOf("teamId")>-1){
        	$scope.type=2;
        	/*修改团队获取数据*/
       		var teamId=get_param($window.location.href, "teamId")*1;
        	$scope.teamId = teamId;
        	//https://devconsole.yingwumeijia.com:443/twitter/team/123/twitterTeam
        	 $http.get([$window.API.TWITTER.TWITTER_TEAM,"/",teamId,"/twitterTeam"].join("")).success(function(res){
                 console.log(res)
                if(res.stateCode===0&&res.data){
                	$scope.dataInfo=res.data;
                }
            });
        }else {
        	$scope.type=1;
        }







        /*验证输入的比例*/
        $scope.valInput=function(value){
			var reg=/^((0|[1-9]\d?)|100)$/;
			if(!reg.test(value)){
			  	$scope.dataInfo.errorMsg="请输入0-100之间的整数";
			  	return false;
			}else {
				$scope.dataInfo.errorMsg="";
				return true;

			}
		}
        /*提交数据*/
        $scope.submitTwitterTeam = function(dt){
            console.log(dt)
        	var nodes=angular.element(".form-control");
      		nodes.blur();
        	$timeout(function(){
	        var nodeErr=angular.element(".err"),
	            datainfo=dt[0];
	        if(nodeErr.length!=0){
	          	return false
	        }
			if(JSON.stringify(dt) != "{}"){
				if(dt.designRatioDto&&dt.buildRatioDto){
					console.log(dt)
					if(!($scope.valInput(dt.designRatioDto.teamRatio)&&$scope.valInput(dt.designRatioDto.memberRatio)&&$scope.valInput(dt.buildRatioDto.teamRatio)&&$scope.valInput(dt.buildRatioDto.memberRatio))){
						return false;
					}
					delete dt.errorMsg;
					console.log("开始提交")
					/*这里提交*/
					//https://devconsole.yingwumeijia.com:443/twitter/team/twitterTeam
					$http({ url:[$window.API.TWITTER.TWITTER_TEAM_TWITTERTEAM].join(""), method:'post',data:dt} ).success(function(res){
		                if(res.stateCode===0){
		                    successMsg.make({msg:'提交成功!'});
		                    $window.location.href = ["#/main/twitter-team-list"].join("");
		                }else{
		                    errorMsg.make({msg:res.message});
		                }
		            });
				}else {
					dt.errorMsg="请输入0-100之间的整数";
				}
			}

      	})


        }







    }])


/**
 *推客管理> 推客列表
 */
sysController.controller("TwitterListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","GET_TOKEN","QINIU", "$grid", "$getSelectTypes",
    function($scope, $http, $window, $cookieStore, $timeout,GET_TOKEN,QINIU, $grid, $getSelectTypesk) {

    	$grid.initial($scope, [$window.API.TWITTER.TWITTER_LIST].join(""),{orderBy:"createTime"});

		/*获取常用枚举*/
        $http.get([$window.API.TWITTER.TWITTER_ENUMS].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.applyStatus =res.data.applyStatus;//申请状态
                $scope.industryStatus =res.data.industryStatus ; //行业
                $scope.payToolTypes=res.data.payToolTypes ;//打款方式
            }
        })

		/*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));

        /*是否属于推客团队*/
       	$scope.$watch('list.isTeam',function(dt){
            postData.isTeam=dt==-1?"":dt;
            $scope.filtering(postData);
        })
        /*是否允许发展下线*/
        $scope.$watch('list.isAllow',function(dt){
            postData.isAllow=dt==-1?"":dt;
            $scope.filtering(postData);
        })
        /*是否存在待结佣金*/
        $scope.$watch('list.isToSettle',function(dt){
            postData.isToSettle=dt==-1?"":dt;
            $scope.filtering(postData);
        })

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            dt.queryKey?postData.queryKey=dt.queryKey:postData.queryKey="";
            $scope.filtering(postData);
        }
        /*查询待结佣*/
        function searchAccount(twitterId){
            $http.get([$window.API.TWITTER.TWITTER_ACCOUNT_LAST,"/",twitterId].join("")).success(function(res){
            	$scope.pay={};
                if(res.stateCode===0&&res.data){
                	$scope.pay.twitterId=twitterId;
                    $scope.pay.toSettleAmount =(res.data.balance).toFixed(2);
                }
            });
        }
		/*立即结佣*/
		var selector=angular.element("#upPhotosBtn").nextAll(".img-show-box");
		$scope.atOnceAccount = function(twitterId){
			searchAccount(twitterId);
            selector.attr("data-url","").html("");//删除图片
            angular.element('.createDialog-atOnceAccount').modal({backdrop: 'static', keyboard: false});
		}

        /*提交dialog-立即结佣*/
        var ispass=true;
        $scope.createDialogSumbitAtOnceAccount=function(dt){
            $scope.pay.voucher =selector.attr('data-url')?selector.attr('data-url'):null;
            var data=dt;
            if(! /^\d+(\.\d{1,2})?$/.test(data.inputSettleAmount)){
                $scope.pay.errorMsg="结佣金额为纯数字，最多2位小数！";
                return false
            }
            if(data.inputSettleAmount==0){
                $scope.pay.errorMsg="结佣金额不能为0";
                return false
            }
            if((data.inputSettleAmount)*1>data.toSettleAmount*1){
                $scope.pay.errorMsg="结佣金额不能超过待结佣金额！";
                return false
            }
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;
			var postData = {
			  	"transferAmount": data.inputSettleAmount,
			  	"transferTool": data.payMode,
			  	"credential": data.voucher,
			  	"postscript": data.remark
			}
            if(!ispass){return false}
                ispass=false;
                //https://devconsole.yingwumeijia.com:443/twitter/transfers/123
                $http({ url:[$window.API.TWITTER.TWITTER_TRANSFERS,"/",data.twitterId].join(""), method:'post',data:postData} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();
                        angular.element('.createDialog-atOnceAccount').modal('hide');
                        selector.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
        	}


		/*是否发展下线*/
        $scope.isAllowUnder=function(id,bl){
            if(confirm("确定"+(bl?"允许":"不允许")+"发展下线？")){
                $http.post([$window.API.TWITTER.TWITTER_ISABLED,"/",id,"/allow?allow=",bl?true:false].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make();
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                })
            }
        };


        /*查看推客详情*/
        $scope.show = function(id) {
            $window.location.href = ["#/main/twitter-list-info?id=", id].join("");
        };
		/*备注*/
		$scope.plan={};
	    $scope.setPlanDialog=function(twitterId){
	    	//https://devconsole.yingwumeijia.com:443/twitter/123/remarks
			$http.get([$window.API.TWITTER.TWITTER_REMARKS,"/",twitterId,"/remarks"].join("")).success(function(res){
	            if(res.stateCode===0){
            		var rems = res.data?res.data.remarks:"";
	            	$scope.plan={
			    		twitterId:twitterId,
			    		remarks:rems
			    	}
	            }
	       });
	      	angular.element('.createDialog-remarks').modal({backdrop: 'static', keyboard: false});
	    }


	    /*提交备注*/
	    $scope.setPlan=function(dt){
	      	var data=dt;
      		if(data.remarks==""||!data.remarks){
	        	$scope.plan.errorMsg="请填写备注！";
	        	return false;
	      	}
	      	$scope.plan.errorMsg=null;
	      	delete data.errorMsg;

      		//https://devconsole.yingwumeijia.com:443/twitter/123/remarks?remarks=555
        	$http({ url:[$window.API.TWITTER.TWITTER_REMARKS,
        		"/",data.twitterId,
        		"/remarks?remarks=",data.remarks
        	].join(""), method:'post'}).success(function(res){
	          	if(res.stateCode===0){
	            	successMsg.make({msg:'提交成功!'});
	            	angular.element('.createDialog-remarks').modal('hide');
	            	$scope.refresh();
	          	}else{
	            	errorMsg.make({msg:res.message});
	          	}
        	});
	    };

        /*启用/禁用*/
        $scope.isAble=function(id,bl){
        	console.log(bl)
            if(confirm("确定要"+(bl?"启用":"禁用")+"该推客吗？")){
                $http.post([$window.API.TWITTER.TWITTER_ISABLED,"/",id,"/available?available=",bl].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'操作成功!'});
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                })
            }
        };
    }]);



/**
 *推客管理> 推客列表> 推客信息(4TAB)
 */
sysController.controller("TwitterListInfoController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","GET_TOKEN","QINIU","$validate","$grid","$dateTool","$filter",
    function($scope, $http, $window, $cookieStore, $timeout,GET_TOKEN,QINIU,$validate,$grid,$dateTool,$filter) {

        /*初始化*/
        var id=get_param($window.location.href, "id");
        $scope.id=id;
        $scope.createUpInfo={};

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=3;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));

		/*获取常用枚举*/
        $http.get([$window.API.TWITTER.TWITTER_ENUMS].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.payToolTypes=res.data.payToolTypes ;//打款方式
            }
        })


        $(".tab-btn li a").click(function(){
            var t=$(this),i=t.index();
                t.addClass("hover").siblings("a").removeClass("hover");
                $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
                switch(i){
                    case 1: TAB2();break;
                    case 2:TAB3();break;
                }
            // if(i==0||i==3){
            //     $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            // }else if(i==1){
            //     TAB2();
            //     $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            // }
            // else if(i==2){
            //     TAB3();
            //     $(".tab-content>div").eq(i).show().siblings(".tab-content>div").hide();
            // }
            console.log(i)
        });

        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;
        /*查看大图*/
        $scope.showImg=function(url){ $scope.preview=url;};

        /*TAB-1 查询基本信息*/
        $http.get([$window.API.TWITTER.TWITTER_INFO,"/",id].join("")).success(function(res){
        	//console.log(res)
            if(res.stateCode===0){
                $scope.dataInfo =res.data;

            }
        });



        /*TAB-2 客户信息*/
        function TAB2(){
            $grid.initial($scope, [$window.API.TWITTER.TWITTER_CUSTOMER_LIST,"/",id].join(""),{orderBy:"createTime"});
            var postData={};
            $scope.list=[];
            /*获取常用枚举*/
            $http.get([$window.API.TWITTER.TWITTER_CUS_TYPES].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.progressTypes =res.data.progressTypes;//阶段枚举
                    $scope.signContentTypes =res.data.signContentTypes ; //施工类型
                }
            });

            // 进入推客详情
            $scope.show = function(id,type) {
                $window.location.href = ["#/main/twitter-ctr-list-info?id=", id,"&type=",type].join("");
            };


            postData.orderBy="createTime";
            $scope.submitSearch=function(dt){
                var dt=angular.copy(dt)||{};
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime1',endTime:'#endTime1',required:false,isEqual:false});// 时间判断
                if(( $scope.dateThan)){
                    return false;
                }
                postData.beginTime=$filter('date')($.trim(angular.element("#beginTime1").val()), 'yyyy-MM-dd');
                postData.endTime=$filter('date')($.trim(angular.element("#endTime1").val()), 'yyyy-MM-dd');

                dt.queryKey?postData.queryKey=dt.queryKey:postData.queryKey="";
                $scope.filtering(postData);
            };


            /*节点选择*/
            $scope.$watch('list.progressType',function(dt){
                postData.progressType=dt==-1?"":dt;
                $scope.filtering(postData);
            });

            /*行业类型选择*/
            $scope.$watch('list.isRegistered',function(dt){
                postData.isRegistered=dt==-1?"":dt;
                $scope.filtering(postData);
            });

            /*是否登录App选择*/
            $scope.$watch('list.login',function(dt){
                postData.login=dt==-1?"":dt;
                $scope.filtering(postData);
            });

        }

        /*TAB-3 发展下线*/
        function TAB3(){
            $grid.initial($scope, [$window.API.TWITTER.TWITTER_CHILD_LIST,"/",id].join(""),{orderBy:"createTime"});
            var postData={};
            $scope.lists={};
            postData.orderBy="createTime";
            $scope.submitSearch=function(dt){
                var dt=angular.copy(dt)||{};
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
                if(( $scope.dateThan)){
                    return false;
                }
                postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');

                dt.queryKey?postData.queryKey=dt.queryKey:postData.queryKey="";
                $scope.filtering(postData);
            };

            /*行业类型选择*/
            $scope.$watch('lists.level',function(dt){
                console.log(dt)
                postData.level=dt==-1?"":dt;
                $scope.filtering(postData);
            });
            /*是否登录App选择*/
            $scope.$watch('lists.login',function(dt){
                postData.login=dt==-1?"":dt;
                $scope.filtering(postData);
            });

        }



        /*TAB-4 结佣记录列表*/
        getPayList()
        function getPayList(){
            $http.get([$window.API.TWITTER.TWITTER_PAY_LIST,"/",id].join("")).success(function(res){
            	//console.log(res)
                if(res.stateCode===0&&res.data){
                    $scope.payLists =res.data;
                }
            });
        }

        /*查询待结佣*/
        function searchAccount(twitterId){
            $http.get([$window.API.TWITTER.TWITTER_ACCOUNT_LAST,"/",twitterId].join("")).success(function(res){
            	$scope.pay={};
                if(res.stateCode===0&&res.data){
                	$scope.pay.twitterId=twitterId;
                    $scope.pay.toSettleAmount =(res.data.balance).toFixed(2);
                }
            });
        }
		/*立即结佣或新增结佣记录*/
		var selector=angular.element("#upPhotosBtn").nextAll(".img-show-box");
		$scope.atOnceAccount = function(twitterId){
			searchAccount(twitterId);
            selector.attr("data-url","").html("");//删除图片
            angular.element('.createDialog-atOnceAccount').modal({backdrop: 'static', keyboard: false});
		}

        /*提交dialog-立即结佣或新增结佣记录*/
        var ispass=true;
        $scope.createDialogSumbitAtOnceAccount=function(dt){
            $scope.pay.voucher =selector.attr('data-url')?selector.attr('data-url'):null;
            var data=dt;
            console.log(data)
            if(! /^\d+(\.\d{1,2})?$/.test(data.inputSettleAmount)){
                $scope.pay.errorMsg="结佣金额为纯数字，最多2位小数！";
                return false
            }
            if(data.inputSettleAmount==0){
                $scope.pay.errorMsg="结佣金额不能为0";
                return false
            }
            if((data.inputSettleAmount)*1>data.toSettleAmount*1){
                $scope.pay.errorMsg="结佣金额不能超过待结佣金额！";
                return false
            }
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;
			console.log(data);
			var postData = {
			  	"transferAmount": data.inputSettleAmount,
			  	"transferTool": data.payMode,
			  	"credential": data.voucher,
			  	"postscript": data.remark
			}
			console.log(postData);
			console.log([$window.API.TWITTER.TWITTER_TRANSFERS,"/",data.twitterId].join(""))
            if(!ispass){return false}
                ispass=false;
                //https://devconsole.yingwumeijia.com:443/twitter/transfers/456
                //https://devconsole.yingwumeijia.com:443/twitter/transfers/123
                $http({ url:[$window.API.TWITTER.TWITTER_TRANSFERS,"/",data.twitterId].join(""), method:'post',data:postData} ).success(function(res){
                    ispass=true;
                    console.log(res)
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        getPayList();
                        angular.element('.createDialog-atOnceAccount').modal('hide');
                        selector.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
        	}


    }]);


/**
 *推客管理> 客户列表
 */
sysController.controller("TwitterCustomerListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout", "$grid", "$getSelectTypes",
    function($scope, $http, $window, $cookieStore, $timeout, $grid, $getSelectTypes) {
        $grid.initial($scope, [$window.API.TWITTER.TWITTER_CUS_LIST].join(""),{orderBy:"createTime"});

        /*获取常用枚举*/
        $http.get([$window.API.TWITTER.TWITTER_CUS_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.progressTypes =res.data.progressTypes;//阶段枚举
                $scope.signContentTypes =res.data.signContentTypes ; //施工类型
            }
        });

        // 进入推客详情
        $scope.show = function(id,type) {
            $window.location.href = ["#/main/twitter-ctr-list-info?id=", id,"&type=",type].join("");
        };

        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var dt=angular.copy(dt)||{};
            dt.queryKey?postData.queryKey=dt.queryKey:postData.queryKey="";
            postData.teamName=dt.teamName
            $scope.filtering(postData);
        };


        /*节点选择*/
        $scope.$watch('list.progressType',function(dt){
            postData.progressType=dt==-1?"":dt;
            $scope.filtering(postData);
        });

        /*行业类型选择*/
        $scope.$watch('list.isRegistered',function(dt){
            postData.isRegistered=dt==-1?"":dt;
            $scope.filtering(postData);
        });

    }]);

/**
 *推客管理> 客户列表> 客户详情(节点更新)
 */
sysController.controller("TwitterCustomerListInfoController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","GET_TOKEN","QINIU","$validate","$dateTool",
    function($scope, $http, $window, $cookieStore, $timeout,GET_TOKEN,QINIU,$validate,$dateTool) {

        /*初始化*/
        var id=get_param($window.location.href, "id");
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
                $http({ url:[$window.API.TWITTER.TWITTER_CUS_STEP_DEL,"/",id].join(""), method:'post'} ).success(function(res){
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
        $http.get([$window.API.TWITTER.TWITTER_CUS_TYPES].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.progressTypes =res.data.progressTypes;//阶段枚举
                $scope.signContentTypes =res.data.signContentTypes ; //施工类型
            }
        });

        /*节点列表*/
        getStepList()
        function getStepList(){
            $http.get([$window.API.TWITTER.TWITTER_CUS_STEP_LIST,"/",id].join("")).success(function(res){
                if(res.stateCode===0&&res.data){
                    $scope.dataInfo2=res.data.basicInfoDto;
                    $scope.stepLists =res.data.procedureInfoDtos;
                    $scope.paysInfo =res.data.procedureCostDtos;
                }
            });
        }

        /*节点详情*/
        function getStepListInfo(stepId){
            $http.get([$window.API.TWITTER.TWITTER_CUS_STEP_INFO,"/",stepId].join("")).success(function(res){
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
            $http.get([$window.API.TWITTER.TWITTER_CUS_STEP_ACCOUNT,"/",stepId,"/signSettle"].join("")).success(function(res){
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

            var api=stepId?[$window.API.TWITTER.TWITTER_CUS_STEP_EDIT,"/",stepId].join(""):[$window.API.TWITTER.TWITTER_CUS_STEP_ADD].join("");

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


/**
 *推客管理> 推客设置
 */
sysController.controller("TwitterSetController", ["$scope", "$http", "$window", "$cookieStore", "$timeout",
    function($scope, $http, $window, $cookieStore, $timeout) {

        /*获取数据*/
        $http.get([$window.API.TWITTER.TWITTER_GET_SET].join("")).success(function(res){
            if(res.stateCode===0&&res.data){
                $scope.dataInfo =res.data;
            }
        });



        /*判断数据大小*/
        $scope.dataCheck=function(){
            var ar=arguments;
            if(ar.length>2?ar[0]*1+ar[1]*1+ar[2]*1!=100:ar[0]*1+ar[1]*1!=100){
                return ar.length>2?"（种子推客+一级推客+二级推客）的百分比需等于100%!":"（平台提供+商户提供）的百分比需等于100%";
            }else{
                return false;
            }
        };

        /*提交*/
        var submitPass=true;//防阻塞
        $scope.submit=function(dt){
			console.log(dt)

            var infoData=angular.copy(dt);
            /*请求*/
            $timeout(function(){
                submitPass=false;
                //var errLen=$(".err").length;
                //console.log(errLen)
                //if(errLen>0&&!submitPass){
                //    return false;
                //}
                //console.log(infoData)
                $http({ url:[$window.API.TWITTER.TWITTER_SAVE_SET].join(""), method:'POST',data:infoData}).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:"保存成功！"});
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                    submitPass=true;
                });
            });
        };

    }]);
