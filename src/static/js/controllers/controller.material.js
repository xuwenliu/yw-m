/**
 *
 *
 *主材管理 > 主材列表
 */

sysController.controller("materialListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.MATERIAL.MATERIAL_PUB].join(""),{orderBy:"createTime"});

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");


        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };


        /*区域*/
        $scope.$watch('list.areaId',function(dt){
            if(dt!==undefined){
                postData.areaId=dt;
                $scope.filtering(postData);
            }
        });


        /*修改*/
        $scope.edit=function(id){
            $window.location.href = ["#/main/material-list-add?id=", id].join("");
        };


        /*门店*/
        $scope.stores=function(id){
            $window.location.href = ["#/main/material-list-stores?id=", id].join("");
        };

        /*爆款*/
        $scope.bestProduct=function(id){
            $window.location.href = ["#/main/material-list-goods?id=", id].join("");
        };



        /*新增*/
        $scope.add=function(){
            $window.location.href = ["#/main/material-list-add"].join("");
        };

    }]);


/**
 *
 *
 *主材管理 > 主材列表 >门店列表
 */

sysController.controller("materialListStoresController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};


        /*门店列表*/
        $scope.getList=function(searchKey){
            var searchKey=searchKey||"";
            $http.get([window.API.MATERIAL.MATERIAL_PUB,"/",id,"/storeList?storeName=",searchKey].join("")).success(function(res){
                if(res.stateCode===0){
                    $scope.result=res.data;
                }else{
                    errorMsg.make({msg:res.message})
                }
            });
        };
        $scope.getList();//默认
        /*查询*/
        $scope.submitSearch=function(dt){
            $scope.getList(dt);
        };


        /*启用/禁用*/
        $scope.isAva=function(sid,bl){
            // console.log(bl)
            if(confirm("确定要"+(bl===true?'禁用':'启用')+"该门店吗？")){
                $http({ url:[window.API.MATERIAL.MATERIAL_PUB,"/updateAvailable"].join(""), method:'post',data:{ "storeId": sid, "available": !bl}} ).success(function(res){
                    if(res.stateCode===0){
                        $scope.getList()
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.getList()
                    }

                });
            }
        };



        /*编辑*/
        $scope.edit=function(sid,t){
            //t=2 修改 t=3 查看
            $window.location.href = ["#/main/material-list-stores-add?type=",t,"&id=", id,"&storeId=",sid].join("");
        };

        /*新增*/
        $scope.add=function(){
            //type = 1 新增
            $window.location.href = ["#/main/material-list-stores-add?type=1&id=", id].join("");
        };



    }]);




/**
 *
 *主材管理 > 添加/修改主材
 */
sysController.controller("materialAddController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","$timeout",
"$validate","GET_TOKEN","QINIU","$cookieStore","QNV","$sce",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,$timeout,$validate,GET_TOKEN,QINIU,$cookieStore,QNV,$sce) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};
        $scope.dataInfo.extraPhones=[];
        id?$scope.dataInfo.id=id:"";
        $scope.dataInfo.display=true; //默认显示
        $scope.dataInfo.telephone===undefined?$scope.dataInfo.telephone=null:'';
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


        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");


        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;


        /*调用七牛上传*/
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(1,1,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:["brandLogoImage"]}));
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"picAdverts"}));



        /*七牛视频上传*/
        var qiniuVideo = new QiniuJsSDK();
        GET_TOKEN({v:true});
        new QNV.FUN().defFun();
        QNV.OPTION.uptoken=$cookieStore.get("UPTOKENV");
        QNV.FileUploaded({types:1,uri:"/",scope:$scope});//uri临时
        qiniuVideo.uploader($.extend(QNV.OPTION,{browse_button: "upVideoBtn" }));




        /*获取主材优惠券常用枚举*/
        $http.get([window.API.MATERIAL.MATERIAL_PUB,"/couponList"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.materialCouponIds=res.data;
            }else{
                errorMsg.make({msg:res.message})
            }
        });


        //获取大小类
        $http.get([$window.API.BRAND.GET_BRAND_BIG_CLASS,"?getAll=true"].join("")).success(function(res){
            var selector=angular.element(".brand-class");
            if(!res.stateCode) {
                var dt = res.data;
                var strUl = "";
                for (var j in dt) {
                    var str="";
                    for(var i in dt[j]['subTypes']){
                        str+="<label class='inline-block mr20 f12'><input type='checkbox' class='v-top'   data-sid='"+dt[j]['subTypes'][i]['id']+"'  value='"+dt[j]['subTypes'][i]['id']+"'><i class='lh180'>"+dt[j]['subTypes'][i]['name']+"</i></label>"
                    }
                    strUl +="<ul><li class='inline-block'><b  class='inline-block'>" + dt[j]['name'] + "</b><label class='f12 cursor c-999  mr20'>( <input class='v-top selected-all' data-bid='"+dt[j]['id']+"' type='checkbox'/>全选 )</label>"+str+"</li></ul>";
                }



                //console.log(window.Promise);
                //if(window.Promise){
                //    Promise.resolve(
                //        selector.html(strUl)
                //    ).then(function(){
                //        getInfo()
                //    })
                //}else{
                    $timeout(function(){
                        selector.html(strUl);
                        getInfo()
                    },500);
                //}
            }
        });



        //全选
        angular.element(".brand-class").on("change",".selected-all",function(){
            var t=angular.element(this),
                c=t.parent().nextAll("label").children("input:not([disabled])");
            if(t.is(":checked")){
                c.prop("checked",true);
            }else{
                c.prop("checked",false);
            }
        });

        //复选框，全选状态
        angular.element(".brand-class").on("change","input[data-sid]",function(){
            var t=angular.element(this),
                o=t.parents("li").find("label"),
                c=o.eq(0).children("input"),
                n=o.length-1,
                l=o.children("input[data-sid]:checked").length;
            if(!t.is(":checked")){
                c.prop("checked",false);
            }
            if(l==n){
                c.prop("checked",true);
            }
        });

        //获取选择结果数据
        function getAllBrandType(){
            var o=angular.element("input[data-sid]:checked");
            var arr=[];
            o.each(function(){
                var t=$(this);
                var cur;
                var ty=t.parents("li").find("label:eq(0)").children("input");
                cur=(t.attr("data-sid"))*1;
                arr.push(cur)
            });
            return arr;
        }




        //分类选择验证
        $scope.isChecked=function(){
            var len=angular.element("input[data-sid]:checked").length;
            return len>0?!true:!false;
        };

        //获取数据
        $scope.brandInfo={};
        var brandLogoImage=angular.element("#brandLogoImage").next(".img-show-box");
        var picAdverts=angular.element("#picAdverts").next(".img-show-box");
        function getInfo(){
            if(id){
                $http.get([window.API.MATERIAL.MATERIAL_PUB,"/",id,"/materialInfo"].join("")).success(function(res){
                    if(!res.stateCode){
                        $scope.dataInfo=res.data;
                        brandLogoImage.attr("data-url",$scope.dataInfo.logo).html(QINIU.creatDom($scope.dataInfo.logo));
                        picAdverts.attr("data-url",$scope.dataInfo.picAdverts).html(QINIU.creatDom($scope.dataInfo.picAdverts));

                        $scope.dataInfo.telephone===undefined?$scope.dataInfo.telephone=null:'';
                        $scope.dataInfo.extraPhones=res.data.extraPhones||[];

                        res.data.video?$scope.getVideos[0]=res.data.video:"";

                        $timeout(function(){
                            ue.setContent(res.data.depicts ||'');
                        },1000)



                        //初始化已选数据方法
                        function getClassId(dt){
                            var arr=dt||[];
                            for(var j in arr){
                                angular.element("[data-sid='"+arr[j]+"']").attr("checked",true);//.attr("disabled",true)
                            }
                        }
                        //默认全选状态
                        function isAllChecked(){
                            angular.element(".brand-class li").each(function(){
                                var t=$(this),
                                    len=t.find("[data-sid]:checked").length,
                                    n=t.find("label").length-1,
                                    c=t.find("[data-bid]");
                                if(len==n){
                                    c.prop("checked",true);//.attr("disabled",true)
                                }else{
                                    c.prop("checked",false);
                                }
                            })

                        }
                        $timeout(function(){
                            getClassId(res.data.types);
                            isAllChecked()
                        })
                    }
                });

            }
        }

        /*添加电话*/
        $scope.joinServicePhoneModel=function(dt){
            if(dt["phone"]){
                var data=dt;
                var arr=$scope.dataInfo.extraPhones ;
                var arrStr=JSON.stringify($scope.dataInfo.extraPhones); //obj

                if(arrStr.indexOf('"phone":"'+data.phone+'"')>-1){
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
                var arr=$scope.dataInfo.extraPhones ;
                arr.splice(i,1)
            }
        };




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
            // console.log($scope.dataInfo.telephone)
            var nodes=angular.element(".form-control");

            nodes.blur();

            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box","bl":true});
            $timeout(function(){
                var nodeErr=angular.element(".err"),
                    nodeUpErr=angular.element(".upErr"),
                    brandinfo=dt[0];
                // console.log(brandinfo);

                brandinfo.logo=angular.element("#brandLogoImage").next(".img-show-box").attr("data-url");
                brandinfo.picAdverts=angular.element("#picAdverts").next(".img-show-box").attr("data-url");
                brandinfo.types= getAllBrandType();
                $scope.getVideos[0]? brandinfo.video=$scope.getVideos[0]:(delete brandinfo.video);// 视频

                brandinfo.depicts=ue.getContent();//富文本
                if(!brandinfo.depicts){
                    angular.element("#editor").addClass("err");
                }else{
                    angular.element("#editor").removeClass("err");
                }



                if(nodeErr.length!=0||nodeUpErr.length!=0){
                    return false
                }
                $http({ url:[$window.API.MATERIAL.MATERIAL_PUB,"/save"].join(""), method:'POST', data:brandinfo}).success(function(res){
                    if(!res.stateCode){
                        id?successMsg.make({msg:"修改成功！"}):successMsg.make({msg:"添加成功！"});
                        $window.location.href='/#/main/material-list'
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            })
        }



    }])


/**
 *
 *
 *主材管理 > 主材推荐
 */

sysController.controller("materialPushController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.MATERIAL.MATERIAL_PUB,"/recommend"].join(""),{orderBy:"createTime"});


        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};
            postData.orderBy="createTime";
            $scope.filtering(postData);
        };



    }]);


/**
 *
 *
 *主材管理 > 主材定金列表
 */

sysController.controller("materialPayController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","GET_TOKEN","QINIU","$cookieStore",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,GET_TOKEN,QINIU,$cookieStore) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.MATERIAL.MATERIAL_PUB,"/deposit"].join(""),{orderBy:"createTime"});

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");


        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*查询*/
        var postData={};
        postData.orderBy="createTime";
        $scope.submitSearch=function(dt){
            var postData=angular.copy(dt)||{};

            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.payDateBegin=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.payDateEnd=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');

            postData.orderBy="createTime";
            $scope.filtering(postData);
        };


        /*区域*/
        $scope.$watch('list.areaId',function(dt){
            if(dt!==undefined){
                postData.areaId=dt;
                $scope.filtering(postData);
            }
        });

        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=3;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));





        /*打款*/
        $scope.payInfo={};
        var select=angular.element(".img-show-box");
        $scope.createDialog=function(dt){
            $scope.payInfo={};
            $scope.payInfo.id=dt;
            select.attr("data-url",$scope.payInfo.giveInfo ).html(QINIU.creatDom($scope.payInfo.giveInfo ));//删除图片
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };

        /*提交dialog*/
        var ispass=true;
        $scope.pay=function(dt){
            var data=dt;

            $scope.payInfo.giveInfo=select.attr('data-url')?select.attr('data-url'):null;
            if(!data.giveInfo){
                $scope.payInfo.errorMsg="请上传凭证!";
                return false
            }

            $scope.payInfo.errorMsg=null;
            delete data.errorMsg;
            // console.log(data)
            if(data.id&&ispass){
                ispass=false;
                $http({ url:[$window.API.MATERIAL.MATERIAL_PUB,"/giveMoney"].join(""), method:'post',data:data} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();// 刷新信息
                        angular.element('.createDialog').modal('hide');
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };
    }]);



/**
 *门店管理列表> 添加/编辑 门店
 */
sysController.controller("materialListStoresAddController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","$timeout",
    "$validate","GET_TOKEN","QINIU","$cookieStore","QNV","$sce",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,$timeout,$validate,GET_TOKEN,QINIU,$cookieStore,QNV,$sce) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1; //主材id
        var sid=get_param($window.location.href, "storeId")*1; //店id
        var type=get_param($window.location.href, "type")*1;
        $scope.type = type;

        $scope.dataInfo={};
        $scope.get720datas=[];
        $scope.alternative = false;//禁止上传门店图片
        $scope.forbid720 = false;//禁止上传720
        $scope.mapPoint="";//初始坐标


        /*调用七牛上传*/
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        /*上传门店图片-删除图片后执行的回调*/
        QINIU.FUN(1,1,$scope,function(){
            $scope.forbid720 = false;//允许上传720
            $scope.$apply();
        });
        //上传720封面
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:["storeCover"]}));


        //上传门店图片
        QINIU.FileUploaded();
        /*cd:上传门店图片成功执行的回调*/
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:["storeImg"]},
            {cb:function(){
                $scope.forbid720 = true;//禁止上传720
                $scope.$apply();
            }
        }));






        /*数据验证规则*/
        $scope.pubRegex=$validate.pubRegex.rule;
        var storeCover=angular.element("#storeCover").nextAll(".img-show-box");//720封面
        var storeImg=angular.element("#storeImg").nextAll(".img-show-box");//门店图片

        /*获取数据*/
        if(sid){
            $http.get([window.API.MATERIAL.MATERIAL_PUB,"/",sid,"/storeInfo"].join("")).success(function(res){
                if(!res.stateCode){
                    // console.log(res)
                    $scope.dataInfo=res.data;

                    if($scope.dataInfo.storeCover){
                        storeCover.attr("data-url",$scope.dataInfo.storeCover).html(QINIU.creatDom($scope.dataInfo.storeCover));
                        $scope.alternative = true;//禁止上传门店图片
                    }
                    if($scope.dataInfo.storeImg){
                        storeImg.attr("data-url",$scope.dataInfo.storeImg).html(QINIU.creatDom($scope.dataInfo.storeImg));
                        $scope.forbid720 = true;//禁止上传720
                    }
                    res.data.pathOf720?$scope.get720datas=[{pathOf720:res.data.pathOf720}]||[]:"";
                    $scope.mapPoint=res.data.pointDto&&(res.data.pointDto.longitude+"|"+res.data.pointDto.latitude)||""
                    getMapInfo();
                }
            });

        }else{
            getMapInfo()
        }

    /**
     *百度地图API
     *
     * */
    function getMapInfo(){
        var defPoint=$scope.dataInfo.pointDto||{
                //longitude:86.830118,
                //latitude:42.337807
            };//获取默认坐标；
        // console.log(defPoint)
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(defPoint['longitude']||104.074641,defPoint['latitude']||30.656087); //默认成都
        var geoc = new BMap.Geocoder();
        map.centerAndZoom(point,12);
        map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

	    var ac =new BMap.Autocomplete({//建立一个自动完成的对象
            "input":"suggestId",
            "location":map
        })
        ac.addEventListener("onhighlight",function(e){ //鼠标放在下拉列表上的事件
            // console.log(e)
            var _value = e.fromitem.value;
            var value = "";
            if(e.fromitem.index>-1){
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }else if(e.toitem.index > -1){
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            $scope.mapAddr = value;
            writePoint(value);
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            // console.log(e)
    	    var _value = e.item.value;
    		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            $scope.mapAddr = myValue;
            writePoint(myValue);
    		setPlace();
    	});

        function setPlace(){
    		map.clearOverlays();    //清除地图上所有覆盖物
    		function myFun(){
    			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
    			map.centerAndZoom(pp, 18);
    			map.addOverlay(new BMap.Marker(pp));    //添加标注
    		}
    		var local = new BMap.LocalSearch(map, { //智能搜索
    		  onSearchComplete: myFun
    		});
    		local.search(myValue);
    	}

        if(defPoint["longitude"]){
            var p={lng:defPoint.longitude,lat:defPoint.latitude};
            setMarker(p);
            cityTool();
            // setAddr(p);
        }else{
            var myCity = new BMap.LocalCity();
            myCity.get(myFun);
        }
        /**
         * [writePoint 输入查询位置回车或鼠标点击后设置地图位置的经纬度]
         * @return {[type]} [description]
         */
        function writePoint(addr) {
            var myGeo = new BMap.Geocoder();
        	// 将地址解析结果显示在地图上,并调整地图视野
        	myGeo.getPoint(addr, function(point){
        		if (point) {
                    setPoint(point);
                    // console.log(point)
        			// map.centerAndZoom(point, 16);
        			// map.addOverlay(new BMap.Marker(point));
        		}else{
        			alert("您选择地址没有解析到结果!");
        		}
        	}, "成都市");
        }

        //单击获取点击的经纬度
        map.addEventListener("click",function(e){
            map.clearOverlays();//清除小红点
            setMarker(e.point);
            setPoint(e.point);
            setAddr(e.point);

        });

        //--------------------------------调用方法
        //按IP获取当前城市
        function myFun(result){
            var cityName = result.name;
            map.setCenter(cityName);
            // console.log("当前定位城市:"+cityName);
            cityTool();//定位后再执行城市控件
        }

        //设置城市控件
        function cityTool(){
            var size = new BMap.Size(10, 20);
            map.addControl(new BMap.CityListControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: size,
                // 切换城市之间事件
                // onChangeBefore: function(){
                //    alert('before');
                // },
                // 切换城市之后事件
                // onChangeAfter:function(){
                //   alert('after');
                // }
            }));
        }

        //描点覆盖物
        function setMarker(point){
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);//位置气泡
            marker.enableDragging(); //marker可拖拽
            // var label= new BMap.Label($scope.dataInfo.storeName||"未设置店名",{offset:new BMap.Size(20,-10)});
            //marker.setLabel(label);//标注名称
            marker.addEventListener("dragend",function(){//拖拽之后回调
                var dragPoint = marker.getPosition();
                setPoint(dragPoint);
                setAddr(dragPoint);
            });

        }
        //设置查询位置
        function setAddr(point) {
            // console.log(point)
            /*数据获取*/
            if( !($scope.dataInfo.pointDto)){
                $scope.dataInfo.pointDto={}
            }
            $scope.dataInfo.pointDto.longitude=point.lng;
            $scope.dataInfo.pointDto.latitude =point.lat;
            geoc.getLocation(point, function(rs){
    			var addComp = rs.addressComponents;
                $scope.mapAddr=addComp.province+addComp.city+addComp.district+addComp.street+addComp.streetNumber;
                $scope.$apply();
    			//alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
    		});
        }
        //设置ng经纬度
        function setPoint(point){
            /*数据获取*/
            if( !($scope.dataInfo.pointDto)){
                $scope.dataInfo.pointDto={}
            }
            $scope.dataInfo.pointDto.longitude=point.lng;
            $scope.dataInfo.pointDto.latitude =point.lat;
            $scope.mapPoint=point.lng + "|" + point.lat;
            $scope.$apply();
            // console.log($scope.mapPoint)
        }



    }

        /**
         *create720
         *
         * */

        /*720上传*/
        $("form[action]").attr("action",$window.API.CASE.FORM_720);

        //iframe路径
        var iframeUrl= window.location.origin + "/templates/child.html";
        $scope.childURL = iframeUrl;
        $("#upfiles").change(function(){
            var t=$(this);
            var localStr= t.val().toLowerCase();
            if(!(/\.(rar|zip)$/i.test(localStr))){
                errorMsg.make({msg:'请上传.rar,.zip扩展名的720文件包！'});
                t.val("");
                return false
            }
            t.parents("form").submit();
            t.val("");
            $('.loading').text("上传中...请稍等！");
            $scope.create720Info.errorMsg="";
        });

        /*拼接720地址*/
        $scope.view720=function(dt){
            var dt = dt||"";
            var o = JSON.parse(dt).path;
            var host = window.Host720;
            var thumb =window.thumb720;

            var sp=dt.split("/");
            return [host+"/images/common/index.html?directory="+sp[2]+"&subDirectory="+sp[3],host+o+thumb];
        };

        function create720(){
            //创建上传720模态
            this.create720Dialog=function(selector720Val){
                var that=this;
                $scope.create720Dialog=function(dt){
                    var index=dt['index'];
                    $scope.maxlength=dt['maxLen'];
                    // console.log(dt['lastData']);
                    /**/
                    $timeout(function(){
                        $scope.maxlengtherr=dt['lastData']&&(dt['lastData'].length)>=dt['maxLen'];
                        angular.element('.up720Dialog').modal({backdrop: 'static', keyboard: false});
                        $scope.create720TitleAdd=index>=0?false:true
                    });
                    $scope.create720Info=angular.copy(dt['addData']); //注意 = 与 copy()区别，后者仅仅是复制数据
                    that.upfileDone(dt['lastData'],index,selector720Val)
                };
            };
            //添加到前端列表
            this.upfileDone=function(ele,index,selector720Val){
                $scope.create720Sumbit=function(dt){

                    var data=dt;
                    // console.log(index);
                    var dataArr=ele?ele:[];
                    data.pathOf720=$(selector720Val).val();
                    if(!data.pathOf720){
                        if(  !$('.loading').text()){
                            $scope.create720Info.errorMsg="请上传720!";
                        }
                        return false
                    }

                    $scope.create720Info.errorMsg=null;
                    delete data.errorMsg;

                    var bl=dataArr.some(function(x){ return x==data });

                    if(!bl&&!(index>=0)){
                        $scope.alternative = true;//禁止上传门店图片
                        dataArr.push(data);//绑定自动 ng-model
                        successMsg.make({msg:"添加成功！"});

                    }else if(index>=0){
                        $scope.alternative = true;//禁止上传门店图片
                        dataArr.splice(index,1,data);
                        successMsg.make({msg:"修改成功！"});
                    }

                    //console.log(dataArr);
                    angular.element('.up720Dialog').modal('hide');
                    angular.element('.create720DialogCheck').blur();
                };
            };
            /*删除列表图片*/
            this.create720Del=function(){
                $scope.create720Del=function(dt){
                    // console.log(dt);
                    $scope.alternative = false;//禁止上传门店图片
                    var arr=dt[0],
                        n=arr.length,
                        i=n>0?arr.indexOf(dt[1]):0;
                        arr.splice(i,1);
                }

            };
            //预览720
            this.create720Show=function(){
                $scope.create720Show=function(dt){
                    // $(".myModal720 iframe").attr("src",dt);
                    $scope.show720Url = $sce.trustAsResourceUrl(dt);
                };
            }
        }

        var c720= new create720();
        c720.create720Dialog(".krpano-hidden");
        c720.create720Del();
        c720.create720Show();
        /*当移除720时，同时删除上传的封面*/
        $scope.$watch("get720datas[0]",function(d){
            if(!d){
                delete $scope.dataInfo.storeCover;
                storeCover.attr("data-url","").html(QINIU.creatDom(""));
            }
        })
        $scope.submit=function(dt){
            var nodes=angular.element(".form-control");
            nodes.blur();
            /*图片验证*/
            $validate.UpImgValidate({"selector":".img-show-box:not('.storeImg')","bl":$scope.get720datas[0]});

            $timeout(function(){

                var nodeErr=angular.element(".err"),
                    nodeUpErr=angular.element(".upErr")
                    datainfo=dt[0];
                datainfo.materialId=id;

                datainfo.storeCover=angular.element("#storeCover").nextAll(".img-show-box").attr("data-url");
                datainfo.storeImg = angular.element("#storeImg").nextAll(".img-show-box").attr("data-url");

                datainfo.pathOf720=$scope.get720datas[0]?$scope.get720datas[0].pathOf720:$scope.get720datas[0];
                if(!(datainfo.pathOf720 || datainfo.storeImg)){
                    alert("请上传门店720或门店图片");
                    return false;
                }

                !datainfo.pathOf720? delete  datainfo.storeCover:"";
                if(nodeErr.length!=0||nodeUpErr.length!=0){
                    return false
                }

                // console.log(datainfo);
                // return false;
                $http({ url:[$window.API.MATERIAL.MATERIAL_PUB,"/saveOrUpdate/store"].join(""), method:'POST', data:datainfo}).success(function(res){
                    if(!res.stateCode){
                        successMsg.make({msg:"添加成功！"});
                        $window.location.href="#/main/material-list-stores?id="+id
                    }else{
                        errorMsg.make({msg:res.message});
                    }
                });
            })
        }

    }]);



/**
 *
 *
 *主材管理 > 主材列表 > 爆款列表
 */

sysController.controller("materialListGoodsController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","QINIU","GET_TOKEN","$cookieStore",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,QINIU,GET_TOKEN,$cookieStore) {

        /*初始数据*/
        var id=get_param($window.location.href, "id")*1;
        $scope.dataInfo={};
        /*列表数据*/
        $grid.initial($scope, [$window.API.MATERIAL.MATERIAL_PUB,"/",id,"/productList"].join(""),{orderBy:"createTime"});
        /*调用七牛上传*/
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(1,1,$scope);
        QINIU.FileUploaded();
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:["upPhotosBtn"]}));


        /*创建信息*/
        var selector=angular.element("#upPhotosBtn").nextAll(".img-show-box");
        $scope.addGoodsInfoDialog=function(g){
            $scope.createUpInfo=angular.copy(g)||{};
            angular.element('.upInfoDialog').modal({backdrop: 'static', keyboard: false});
            !g?selector.attr("data-url","").html(""):selector.attr("data-url",g.productImg).html(QINIU.creatDom(g.productImg));

        };
        /*提交弹出信息*/
        var  ispass=true;
        $scope.createUpInfoSumbit=function(dt){
            var data=dt;
            var attr=selector.attr("data-url");

            $scope.createUpInfo.productImg=attr;

            if(!data.productImg){
                $scope.createUpInfo.errorMsg="请上传图片！";
                return false
            }
            /*if(!data.productUrl){
                $scope.createUpInfo.errorMsg="请输入Url！";
                return false
            }*/
            $scope.createUpInfo.errorMsg=null;
            delete data.errorMsg;
            data.materialId=id;

            // console.log(data);
            if(!ispass){return false}
            ispass=false;
            $http.post([$window.API.MATERIAL.MATERIAL_PUB,"/saveOrUpdate/product"].join(""),data).success(function(res){
                ispass=true;
                if(res.stateCode===0){
                    angular.element('.upInfoDialog').modal('hide');
                    successMsg.make({msg:res.message});
                    $scope.refresh();
                }else{
                    errorMsg.make({msg:res.message})
                    $scope.refresh();
                }

            })
        }




        /*删除*/
        $scope.del=function(sid){
            if(confirm("确定要删除该爆款吗？")){
                $http({ url:[window.API.MATERIAL.MATERIAL_PUB, "/", sid, "/delete"].join(""), method:'post'} ).success(function(res){
                    if(res.stateCode===0){
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }

                });
            }
        };

        /*置顶*/
        $scope.setTop=function(sid){
            if(confirm("确定要置顶该爆款吗？")) {
                $http.post([window.API.MATERIAL.MATERIAL_PUB, "/", sid, "/moveTop"].join("")).success(function (res) {
                    if (res.stateCode === 0) {
                        $scope.refresh();
                    } else {
                        errorMsg.make({msg: res.message})
                        $scope.refresh();
                    }
                });
            }
        };


    }]);


/**
 *
 *
 *主材管理 > 用户操作日志
 */

sysController.controller("mLogListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","GET_TOKEN","QINIU","$cookieStore",
    function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,GET_TOKEN,QINIU,$cookieStore) {

        /*列表数据*/
        $grid.initial($scope, [$window.API.MATERIAL.MATERIAL_PUB,"/materialLog"].join(""),{orderBy:"createTime"});

        /*平台城市枚举*/
        $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*获取log类型枚举*/
        $http.get([$window.API.MATERIAL.MATERIAL_PUB,"/enums"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.operateTypes=res.data;
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
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');

            postData.orderBy="createTime";
            $scope.filtering(postData);
        };


        /*区域*/
        $scope.$watch('list.areaId',function(dt){
            if(dt!==undefined){
                postData.areaId=dt;
                $scope.filtering(postData);
            }
        });

        /*类型*/
        $scope.$watch('list.operateType',function(dt){
            if(dt!==undefined){
                postData.operateType=dt;
                $scope.filtering(postData);
            }
        });

        /*是否允许*/
        $scope.$watch('list.allow',function(dt){
            if(dt!==undefined){
                postData.allow=dt;
                $scope.filtering(postData);
            }
        });










        /*备注*/
        $scope.createDialog=function(id,info){
            $scope.contentInfo={};
            $scope.contentInfo.remarks=angular.copy(info);
            $scope.materialLogId=id;
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
        };

        /*提交dialog*/
        var ispass=true;
        $scope.pay=function(dt){
            var data=dt;
            $scope.contentInfo.errorMsg=null;
            delete data.errorMsg;
            // console.log(data)
            if($scope.materialLogId&&ispass){
                ispass=false;
                $http({ url:[$window.API.MATERIAL.MATERIAL_PUB,"/",$scope.materialLogId,"/remarks"].join(""), method:'post',data:data} ).success(function(res){
                    ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();// 刷新信息
                        angular.element('.createDialog').modal('hide');
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };
    }]);
