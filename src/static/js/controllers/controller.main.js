/**
 * MENU /USERINFO
 */

var sysController = angular.module("sysController", []);
sysController.controller("MainController", ["$scope", "$http", "$cookieStore", "$rootScope","GET_TOKEN", "$window", "$timeout",function ($scope, $http, $cookieStore, $rootScope,GET_TOKEN, $window,$timeout) {

    /*获取上传GET_TOKEN*/
    GET_TOKEN();
    GET_TOKEN({v:true});

    /*获取IM TOKEN*/
    $http.get(window.API.IM.IM_TOKEN).success(function (res) {
        if(res.stateCode===0){
            res.data.appKey=window.IMAppKey
            $cookieStore.put("im_token",res.data);
        }else{
            $cookieStore.remove("im_token");
        }
    });



    /*tagsBaseText*/
    $scope.tagsBaseText={
        face:"图片比例：1:1、尺寸1500 * 1500 像素以上； 建议大小1MB-10MB之间 ",
        design_l:"图片比例不限、图片宽度1000像素以上、黑白色；建议大小1MB-10MB之间 ",
        design_r:"图片比例：3:2（高）、尺寸1500*1000像素以上、彩色；去掉尺寸、文字、标注等无用信息，左右留一定边距；建议大小1MB-10MB之间",
        common:"图片比例不限、图片宽度1000像素以上； 建议大小1MB-10MB之间"
    };


    $scope.menus= {
        "menus": [
            {
                "sysType":"1",
                "name": "首页",
                "id": 10000,
                "url": "",
                "icon": "&#xe609;",
                "childs": [
                    {
                        "name": "统计简报",
                        "id": 13000,
                        "url": ".default",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "每日数据",
                        "id": 13000,
                        "url": ".every-data",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "平台业者管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe60e;",
                "childs": [
                    {
                        "name": "平台业者列表",
                        "id": 13000,
                        "url": ".manager",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "公司管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe607;",
                "childs": [
                    {
                        "name": "监理公司列表",
                        "id": 13000,
                        "url": ".jl-company-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "装修公司列表",
                        "id": 13000,
                        "url": ".business",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "申请入驻列表",
                        "id": 13000,
                        "url": ".company-apply",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "公司服务内容",
                        "id": 13000,
                        "url": ".service-set",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "作品管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe606;",
                "childs": [
                    {
                        "name": "作品列表",
                        "id": 13000,
                        "url": ".case-list",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "客户管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe60c;",
                "childs": [
                    {
                        "name": "客户列表",
                        "id": 13000,
                        "url": ".customer",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "家居顾问管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe686;",
                "childs": [
                    {
                        "name": "家居顾问列表",
                        "id": 13000,
                        "url": ".decorate-sell-list",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "推客管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe61a;",
                "childs": [
                    /*v1.11.0隐藏{
                        "name": "申请列表",
                        "id": 13000,
                        "url": ".twitter-apply-list",
                        "childs": [],
                        "icon": ""
                    },*/
                   	{
                        "name": "结佣清单",
                        "id": 13000,
                        "url": ".twitter-team-commission-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "团队列表",
                        "id": 13000,
                        "url": ".twitter-team-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "推客列表",
                        "id": 13000,
                        "url": ".twitter-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "客户列表",
                        "id": 13000,
                        "url": ".twitter-ctr-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "推客设置",
                        "id": 13000,
                        "url": ".twitter-set",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "品牌管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe613;",
                "childs": [
                    {
                        "name": "品牌列表",
                        "id": 13000,
                        "url": ".brand",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "主材管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe60d;",
                "childs": [
                    {
                        "name": "主材列表",
                        "id": 13000,
                        "url": ".material-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "主材推荐列表",
                        "id": 13000,
                        "url": ".material-push-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "补贴资格列表",
                        "id": 13000,
                        "url": ".material-pay-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "用户操作日志",
                        "id": 13000,
                        "url": ".material-log",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "账单管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe725;",
                "childs": [
                    {
                        "name": "账单列表",
                        "id": 13000,
                        "url": ".bill-list",
                        "childs": [],
                        "icon": ""
                    }

                ]
            },

            {
                "name": "订单管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe66c;",
                "childs": [
                    {
                        "name": "订单列表",
                        "id": 13000,
                        "url": ".orders-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": " 监理订单列表",
                        "id": 13000,
                        "url": ".jl-orders",
                        "childs": [],
                        "icon": ""
                    },

                ]
            },

            {
                "name": "会话管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe608;",
                "childs": [
                    {
                        "name": "会话列表",
                        "id": 13000,
                        "url": ".im-list",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "活动管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe611;",
                "childs": [

                    {
                        "name": "活动列表",
                        "id": 13000,
                        "url": ".activity",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "优惠券管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe610;",
                "childs": [

                    {
                        "name": "优惠券列表",
                        "id": 13000,
                        "url": ".coupon-list",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "拼团管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe610;",
                "childs": [

                    {
                        "name": "拼团列表",
                        "id": 13000,
                        "url": ".groupbuy-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "拼团券管理",
                        "id": 13000,
                        "url": ".groupbuy-coupon",
                        "childs": [],
                        "icon": ""
                    }

                ]
            },

            {
                "name": "楼盘管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe75f;",
                "childs": [

                    {
                        "name": "楼盘列表",
                        "id": 13000,
                        "url": ".building-list",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },

            {
                "name": "广告管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe65a;",
                "childs": [
                    {
                        "name": "广告列表",
                        "id": 13000,
                        "url": ".a-d-list",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "C端主页管理",
                "id": 10000,
                "url": "",
                "icon": "&#xe65a;",
                "childs": [
                    {
                        "name": "banner管理",
                        "id": 13000,
                        "url": ".banner-list",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "热门作品管理",
                        "id": 13000,
                        "url": ".hot-case",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "免费报价用户数据",
                        "id": 13000,
                        "url": ".ask-price",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },


            {
                "name": "用户反馈",
                "id": 10000,
                "url": "",
                "icon": "&#xe60f;",
                "childs": [
                    {
                        "name": "反馈列表",
                        "id": 13000,
                        "url": ".feedback",
                        "childs": [],
                        "icon": ""
                    }
                ]
            }
            ,
            {   "sysType":"2",
                "name": "首页",
                "id": 10000,
                "url": "",
                "icon": "&#xe63a;",
                "childs": [
                    {
                        "name": "统计简报",
                        "id": 13000,
                        "url": ".data-lists-default",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "C端用户数据",
                "id": 10000,
                "url": "",
                "icon": "&#xe637;",
                "childs": [
                    {
                        "name": "用户数据趋势",
                        "id": 13000,
                        "url": ".data-user-trend",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "来源渠道分布图",
                        "id": 13000,
                        "url": ".data-user-source",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "C端功能数据",
                "id": 10000,
                "url": "",
                "icon": "&#xe612;",
                "childs": [
                    {
                        "name": "作品类型分布图",
                        "id": 13000,
                        "url": ".data-cases-types",
                        "childs": [],
                        "icon": ""
                    },
                    {
                        "name": "作品数据趋势图",
                        "id": 13000,
                        "url": ".data-cases-trend",
                        "childs": [],
                        "icon": ""
                    }
                    ,
                    {
                        "name": "作品功能使用数据图",
                        "id": 13000,
                        "url": ".data-cases-used",
                        "childs": [],
                        "icon": ""
                    }
                    ,
                    {
                        "name": "会话数据趋势图",
                        "id": 13000,
                        "url": ".data-imsg-trend",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
            {
                "name": "E端用户数据",
                "id": 10000,
                "url": "",
                "icon": "&#xe649;",
                "childs": [
                    {
                        "name": "E端用户数据表",
                        "id": 13000,
                        "url": ".data-lists-e",
                        "childs": [],
                        "icon": ""
                    }
                ]
            },
        ]
    };

    $scope.showMail = function() {
         $window.location.href = "#/main/mail-list";
    };

    //菜单效果
    $scope.$on("ngRepeatMenu",function(){
        //render 完成后执行JS
        var icon=angular.element(".menus .iconfont"),
            menus=angular.element(".menus dt"),
            m_a=angular.element(".menus dd a"),
            iconArr=$scope.menus.menus,
            urlArr=[],
            tag=window.location.hash;

        icon.each(function(j){
            $(this).html(iconArr[j].icon)
        });

        menus.on("click", function(){
            var t=$(this),
                isSwap=true;
            !t.hasClass("hover")&&isSwap?t.next("dd").slideDown(100).parents("dl").siblings().find("dd").slideUp(100):t.next("dd").slideDown(100);
            t.addClass("hover").parents("dl").siblings().find("dt").removeClass("hover");
        });

        m_a.each(function(){
            var hashStr=tag;//"."+tag.split("/").reverse()[0],
                urlStr=$(this).attr("ui-sref").replace(".","");
                urlArr.push(urlStr);


            if(hashStr.indexOf(urlStr)>-1){
                console.log(urlStr)
                console.log(1)
                $(this).addClass("hover").parents("dd").prev("dt").click();
            }
        }).click(function(){
            $(this).addClass("hover").siblings().removeClass("hover");
            var url;
            if (!!window.location.port) {
                url = "http://" + window.location.hostname + ":" + window.location.port + "/" + $(this).attr("href");
            }
            else {
                url = "https://" + window.location.hostname + "/" + $(this).attr("href");
            }
            var href = window.location.href;
            if (url == href) {
                window.location.reload();
            }
        });

        //后退菜单状态
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                var hashStr=window.location.hash;
                m_a.removeClass("hover");
                for(var  j in urlArr){
                    if(hashStr.indexOf(urlArr[j])>-1){
                        $(".menus a[href *= '"+urlArr[j]+"']").addClass("hover").parents("dd").prev("dt").click();
                    }
                }
            });
        }

    });






}]);