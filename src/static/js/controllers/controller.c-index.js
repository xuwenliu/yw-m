/**
 *C端首页管理 > banner
 */
sysController.controller("bannerListController", ["$scope", "$http", "$window","$grid","$validate","QINIU","GET_TOKEN","$cookieStore",
  function($scope, $http, $window,$grid,$validate,QINIU,GET_TOKEN,$cookieStore) {



    /*调用七牛上传*/
    GET_TOKEN();
    QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
    QINIU.FUN(1,1,$scope);
    QINIU.FileUploaded();
    Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:["upPhotosBtn"]}));





    /*数据验证规则*/
    $scope.pubRegex=$validate.pubRegex.rule;

    /*获取列表*/
   function getList(){
     $http.get([$window.API.BANNER.BANNER_PUB,"/getAll"].join("")).success(function(res){
       if(res.stateCode===0){
         $scope.girdList=res.data;
       }
     });
   }
    getList()

    /*启用/禁用*/
    $scope.isAllow=function(id,bl){
      if(confirm("确定要"+(bl===1?'启用':'禁用')+"当前banner吗？")){
        $http.post([$window.API.BANNER.BANNER_PUB,"/",id,"/updateState/",bl].join("")).success(function(res){
          if(res.stateCode===0){
            getList()
          }else{
            errorMsg.make({msg:res.message});
            getList()
          }
        });
      }
    };

    /*删除*/
    $scope.del=function(id){
      if(confirm("确定要删除当前banner？")){
        $http.post([$window.API.BANNER.BANNER_PUB,"/",id,"/delete"].join("")).success(function(res){
          if(res.stateCode===0){
            successMsg.make({msg:"删除成功！"});
            getList()
          }else{
            errorMsg.make({msg:res.message});
            getList()
          }
        });
      }
    };




    /*创建信息*/
    var selector=angular.element("#upPhotosBtn").nextAll(".img-show-box");
    $scope.addBannerDialog=function(g){
      $scope.createUpInfo=angular.copy(g)||{};
      angular.element('.upInfoDialog').modal({backdrop: 'static', keyboard: false});
      !g?selector.attr("data-url","").html(""):selector.attr("data-url",g.image).html(QINIU.creatDom(g.image));

    };
    /*提交弹出信息*/
    var  ispass=true;
    $scope.createUpInfoSumbit=function(dt){
      var data=dt;
      var attr=selector.attr("data-url");

      $scope.createUpInfo.image=attr;

      if(!data.image){
        $scope.createUpInfo.errorMsg="请上传图片！";
        return false
      }

      if(data.url&&!(data.title)){
        $scope.createUpInfo.errorMsg="若跳转，标题不能为空！";
        return false
      }


      $scope.createUpInfo.errorMsg=null;
      delete data.errorMsg;
      delete data.enable;
      delete data.orderNo;

      console.log(data);
      if(!ispass){return false}
      ispass=false;
      $http.post([$window.API.BANNER.BANNER_PUB,"/add"].join(""),data).success(function(res){
        ispass=true;
        if(res.stateCode===0){
          angular.element('.upInfoDialog').modal('hide');
          successMsg.make();
          getList()
        }else{
          errorMsg.make({msg:res.message})
          getList()
        }

      })
    }



    /*找出数组重复数及下标位置*/
    Array.prototype.formatArr=function(){
      var t=this, _o={}, _d={}, r={};
      t.forEach(function(x){
        var j=0;
        t.forEach(function(y,n){
          if(x==y){
            j++;
            if(j>1){
              _o[n]=0;
              _d[y]=0;
            }
          }
        })
      });
      r.reIndex= Object.keys(_o);
      r.reData = Object.keys(_d);
      return r
    };



    /*排序判断*/
    $scope.checkNumber=function(c,i,a){
      if(c&&(c*1<=a.length)){
        var arr=a.map(function(x){return x["orderNo"]});
        var index= arr.formatArr().reIndex;
        var ii=index.map(function(x){return x*1});
      }
      return ii
    }


    /*提交排序*/
    $scope.sortButton=function(a){
      var ele=angular.element(".err");
      ispass=true;
      if(ele.length&&ispass){
        return false
      }

      ispass=false;
      var data=a.map(function(x){ return {id:x.id,orderNo:x.orderNo}});
      $http.post([$window.API.BANNER.BANNER_PUB,"/order"].join(""),data).success(function(res){
        ispass=true;
        if(res.stateCode===0){
          successMsg.make();
          getList()
        }else{
          errorMsg.make({msg:res.message});
          getList()
        }

      })

    }

  }]);



/**
 *C端首页管理 > 热门作品
 */
sysController.controller("hotCaseListController", ["$scope", "$http", "$window","$grid","$validate","QINIU","GET_TOKEN","$cookieStore",
  function($scope, $http, $window,$grid,$validate,QINIU,GET_TOKEN,$cookieStore) {


    /*数据验证规则*/
    $scope.pubRegex=$validate.pubRegex.rule;

    /*获取列表*/
    function getList(){
      $http.get([$window.API.HOTCASE.HOTCASE_PUB,"/getAll"].join("")).success(function(res){
        if(res.stateCode===0){
          $scope.girdinfo=res.data;
        }
      });
    }
    getList()

    /*删除*/
    $scope.del=function(id){
      if(confirm("确定要删除推荐作品？")){
        $http.post([$window.API.HOTCASE.HOTCASE_PUB,"/delete/",id].join("")).success(function(res){
          if(res.stateCode===0){
            successMsg.make({msg:"删除成功！"});
            getList()
          }else{
            errorMsg.make({msg:res.message});
            getList()
          }
        });
      }
    };


    /*找出数组重复数及下标位置*/
    Array.prototype.formatArr=function(){
      var t=this, _o={}, _d={}, r={};
      t.forEach(function(x){
        var j=0;
        t.forEach(function(y,n){
          if(x==y){
            j++;
            if(j>1){
              _o[n]=0;
              _d[y]=0;
            }
          }
        })
      });
      r.reIndex= Object.keys(_o);
      r.reData = Object.keys(_d);
      return r
    };



    /*排序判断*/
    $scope.checkNumber=function(c,i,a){
      if(c&&(c*1<=a.length)){
        var arr=a.map(function(x){return x["orderNo"]});
        var index= arr.formatArr().reIndex;
        var ii=index.map(function(x){return x*1});
      }
      return ii
    }


    /*提交排序*/
    $scope.sortButton=function(a){
      var ele=angular.element(".err");
      ispass=true;
      if(ele.length&&ispass){
        return false
      }

      ispass=false;
      var data=a.map(function(x){ return {id:x.id,orderNo:x.orderNo}});
      $http.post([$window.API.HOTCASE.HOTCASE_PUB,"/order"].join(""),data).success(function(res){
        ispass=true;
        if(res.stateCode===0){
          successMsg.make();
          getList()
        }else{
          errorMsg.make({msg:res.message});
          getList()
        }

      })

    }



  }]);

/**
 *
 *
 *C端首页管理 > 询价用户数
 */

sysController.controller("askPriceListController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","GET_TOKEN","QINIU","$cookieStore",
  function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,GET_TOKEN,QINIU,$cookieStore) {

    /*列表数据*/
    $grid.initial($scope, [$window.API.FREEQUOTE.FREEQUOTE_PUB,"/getAll"].join(""),{orderBy:"createTime"});

    /*查询*/
    var postData={};
    postData.orderBy="createTime";
    $scope.submitSearch=function(dt){
      var postData=angular.copy(dt)||{};
      postData.orderBy="createTime";
      $scope.filtering(postData);
    };

    /*状态*/
    $scope.$watch('list.state',function(dt){
      if(dt!==undefined){
        postData.state=dt;
        $scope.filtering(postData);
      }
    });

    /*设置为标记*/
    $scope.isDone=function(id){
      $http.post([$window.API.FREEQUOTE.FREEQUOTE_PUB,"/mark/",id].join("")).success(function(res){
        if(res.stateCode===0){
          $scope.refresh();
          successMsg.make();
        }else{
          errorMsg.make();
        }
      });
    }

    //详情
    $scope.show = function(id) {
      $window.location.href = ["#/main/ask-price-info?id=",id].join("");
    };


  }]);

/**
 *
 *
 *C端首页管理 > 询价用户数 >详情
 */

sysController.controller("askPriceInfoController", ["$scope", "$http", "$window","$grid","$dateTool","$filter","$getSelectTypes","GET_TOKEN","QINIU","$cookieStore",
  function($scope, $http, $window,$grid,$dateTool,$filter,$getSelectTypes,GET_TOKEN,QINIU,$cookieStore) {

    /*初始数据*/
    var id=get_param($window.location.href, "id")*1;
    $scope.dataInfo={};

    /*平台城市枚举*/
    $getSelectTypes.select($scope,[$window.API.OTHER.GET_CITY_OWN].join(""),null,"cityTypes");


    /*获取PE*/
      //$scope.$watch("dataInfo.peCity",function(areaId){
      // if(!areaId){
      //   return false
      // }
        $http.get([$window.API.FREEQUOTE.FREEQUOTE_PUB,"/getPe/",id].join("")).success(function(res){
          if(res.stateCode===0){
            $scope.peids=res.data
          }else{
            errorMsg.make();
          }
        });
      //});


    /*获取详情*/
    $scope.getInfo=function(id){
      $http.get([$window.API.FREEQUOTE.FREEQUOTE_PUB,"/detail/",id].join("")).success(function(res){
        if(res.stateCode===0){
          $scope.dataInfo=res.data;
          $scope.oldpeCity=res.data.peCity;
          $scope.oldpeId=res.data.peId;
        }else{
          errorMsg.make();
        }
      });
    };
    $scope.getInfo(id);



  /*提交*/
    $scope.submitInfo=function(dt){
      if(!dt){
        return false;
      }
      var data={};

      data.id=id;
      data.peId=dt.peId;
      data.remark=dt.remark;
      console.log(data)

      $http.post([$window.API.FREEQUOTE.FREEQUOTE_PUB,"/update"].join(""),data).success(function(res){
        if(res.stateCode===0){
          successMsg.make();
          $scope.getInfo(id);
        }else{
          errorMsg.make();
        }
      });
    }
  }]);

