/**
 *品牌管理 > 品牌列表
 */
sysController.controller("BrandListController", ["$scope", "$http", "$window","$grid",
  function($scope, $http, $window,$grid) {
    //列表
    $grid.initial($scope, [$window.API.BRAND.GET_BRAND_LIST].join(""),{orderBy:"createTime"});//
    //修改
    $scope.edit=function(dt){
      $window.location.href=["/#/main/brand-add","?id=",dt].join("")
    };
    //查询
    $scope.submitSearch=function(dt){
      //if(dt){
        var postData={};
        postData.likeName=dt;
        postData.orderBy="createTime";
        $scope.filtering(postData);
      //}
    };

  }]);

/**
 *品牌管理 > 添加/修改品牌
 */
sysController.controller("BrandAddController", ["$scope", "$http", "$window", "$cookieStore","GET_TOKEN","QINIU","$validate","$timeout",
  function($scope, $http, $window, $cookieStore, GET_TOKEN,QINIU,$validate,$timeout) {

    var id=get_param($window.location.href, "id");

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
        selector.html(strUl);
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
        var obj={};
        var ty=t.parents("li").find("label:eq(0)").children("input");
        obj.type=ty.attr("data-bid")*1;
        obj.subType=t.attr("data-sid")*1;
        arr.push(obj)
      });
     return arr;
    }

    /*调用七牛上传*/
    GET_TOKEN();
    QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
    QINIU.FUN(1,1,$scope);
    QINIU.FileUploaded();
    Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"brandLogoImage"}));




    //获取数据
    $scope.brandInfo={};
    var brandLogoImage=angular.element("#brandLogoImage").next(".img-show-box");
    if(id){
      $http.get([window.API.BRAND.EDIT_BRAND_INFO,"/",id].join("")).success(function(res){
        if(!res.stateCode){
          $scope.brandInfo=res.data;
          brandLogoImage.attr("data-url",$scope.brandInfo.logo).html(QINIU.creatDom($scope.brandInfo.logo));

          //初始化已选数据方法
          function getClassId(dt){
            var arr=dt||[];
            for(var j in arr){
              angular.element("[data-sid='"+arr[j]['subType']+"']").attr("checked",true).attr("disabled",true);
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
                c.prop("checked",true).attr("disabled",true);
              }else{
                c.prop("checked",false);
              }
            })

          }
          $timeout(function(){
            getClassId(res.data.brandClasses);
            isAllChecked()
          })
        }
      });

    }

    //分类选择验证
    $scope.isChecked=function(){
      var len=angular.element("input[data-sid]:checked").length;
      return len>0?!true:!false;
    };

    /*数据验证规则*/
    $scope.pubRegex=$validate.pubRegex.rule;

    $scope.validateFunc = function(dt) {
        if(dt){
            var v = dt,
                r = $validate.pubRegex.rule.website;
            return  !r.test(v)
        }else{
            return false
        }

    };

    /*提交*/
    $scope.brandInfo.available=true;
    $scope.submit=function(dt){
      var nodes=angular.element(".form-control");

      nodes.blur();

      /*图片验证*/
      $validate.UpImgValidate({"selector":".img-show-box","bl":true});
      $timeout(function(){
        var nodeErr=angular.element(".err"),
            nodeUpErr=angular.element(".upErr"),
            brandinfo=dt[0];
            console.log(brandinfo);
        if(nodeErr.length!=0||nodeUpErr.length!=0){
          return false
        }

        brandinfo.logo=angular.element("#brandLogoImage").next(".img-show-box").attr("data-url");

        brandinfo.brandClasses= getAllBrandType();

        $http({ url:[$window.API.BRAND.ADD_BRAND_INFO].join(""), method:id?'PUT':'POST', data:brandinfo}).success(function(res){
          if(!res.stateCode){
            id?successMsg.make({msg:"修改成功！"}):successMsg.make({msg:"添加成功！"});
            $window.location.href='#/main/brand'
          }else{
            errorMsg.make({msg:res.message});
          }
        });
      })
    }

  }]);