/**
 * router
 */


var sysApp = angular.module("sysApp", ["ui.router", "sysController", "sysService","sysFilter"]);

sysApp.factory('myDetectorSet', function($location, $q,$cookieStore) {
    return {
        response: function(response) {
            if(response.data.stateCode==312) {
                $cookieStore.remove("userName");
                errorMsg.make({msg: "请登录,2秒后自动跳转到登录页!", url: ""});
                return response;
            }else{
                return response;
            }
        },
        request: function(conf){
            return conf;
        },
        requestError: function(err){
            return $q.reject(err);
        },
        responseError: function(err){
            //console.log(err);
            if(err.status === 0) {
                $cookieStore.remove("userName");
                errorMsg.make({msg: "与服务端通信失败!", url: "",second:3});
            } else if(err.status ==404 ) {
                errorMsg.make({msg: "接口地址错误!"});
            } else {
                errorMsg.make({msg: "请求失败!"});
            }
            return $q.reject(err);
        }
    };
});

sysApp.config(['$httpProvider', function($httpProvider) {

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('myDetectorSet');
    $httpProvider.defaults.useXDomain = true;

}]).config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "/login");
    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "/templates/login.html",
            controller: "LoginController"
        })
        .state("main", {
            url: "/main",
            templateUrl: "/templates/main.html",
            controller:"MainController"
        })

        //首页统计
        .state("main.default", {
            url: "/default",
            templateUrl: "/templates/center/count/count.html",
            controller:"CountController"
        })
        //每日数据
        .state("main.every-data", {
            url: "/every-data",
            templateUrl: "/templates/center/count/every-data.html",
            controller:"EveryDataController"
        })

        //角色管理
        .state("main.role", {
            url: "/role",
            templateUrl: "/templates/center/role/role-list.html",
            controller:"RoleController"
        })
        //用户管理
        .state("main.role-user", {
            url: "/role-user",
            templateUrl: "/templates/center/role/role-user.html",
            controller:"RoleUserController"
        })

        //商户列表
        .state("main.business", {
            url: "/business",
            templateUrl: "/templates/center/business/business-list.html",
            controller:"BusinessListController"
        })

        //申请入驻列表
        .state("main.company-apply", {
            url: "/company-apply",
            templateUrl: "/templates/center/business/business-apply-list.html",
            controller:"BusinessApplyListController"
        })

        //申请入驻详情
        .state("main.company-apply-info", {
            url: "/company-apply-info",
            templateUrl: "/templates/center/business/business-apply-info.html",
            controller:"BusinessApplyInfoController"
        })

        //查看商户详情
        .state("main.business-info", {
            url: "/business-info",
            templateUrl: "/templates/center/business/business-info.html",
            controller:"BusinessInfoController"
        })

        //新增商户
        .state("main.business-add", {
            url: "/business-add",
            templateUrl: "/templates/center/business/business-add.html",
            controller:"BusinessAddController"
        })

        //查看商户详情-基本信息
        .state("main.business-info.business-basic", {
            url: "/business-basic",
            templateUrl: "/templates/center/business/business-basic.html",
            controller:"BusinessBasicController"
        })

        //查看商户详情-银行卡信息
        .state("main.business-info.business-bankCard", {
            url: "/business-bankCard",
            templateUrl: "/templates/center/business/business-bankCard.html",
            controller:"BusinessBackCardController"
        })

        //所属作品列表
        .state("main.business-info.business-caseinc-list", {
            url: "/business-caseinc-list",
            templateUrl: "/templates/center/business/business-caseinc-list.html",
            controller:"BusinessCaseIncListController"
        })

        //商户所属从业者列表
        .state("main.business-info.business-staffinc-list", {
            url: "/business-staffinc-list",
            templateUrl: "/templates/center/business/business-staffinc-list.html",
            controller:"BusinessStaffListController"
        })
        //公司详情账户明细
        .state("main.business-info.business-account-flow", {
            url: "/business-account-flow",
            templateUrl: "/templates/center/business/business-account-flow.html",
            controller:"BusinessAccountController"
        })

        //公司详情订单
        .state("main.business-info.business-order-list", {
            url: "/business-order-list",
            templateUrl: "/templates/center/business/business-order-list.html",
            controller:"BusinessOrderController"
        })

        //公司详情--账单列表
        .state("main.business-info.business-bill-list", {
            url: "/business-bill-list",
            templateUrl: "/templates/center/business/business-bill-list.html",
            controller:"BusinessBillController"
        })

        //公司详情退款信息
        .state("main.business-info.business-refund-list", {
            url: "/business-refund-list",
            templateUrl: "/templates/center/business/business-refund-list.html",
            controller:"BusinessRefundController"
        })

        //公司服务设置
        .state("main.service-set", {
            url: "/service-set",
            templateUrl: "/templates/center/business/business-service-phase.html",
            controller:"BusinessServiceController"
        })

        //新增作品基础信息
        .state("main.case-add-base", {
            url: "/case-add-base",
            templateUrl: "/templates/center/case/case-add-base.html",
            controller:"CaseAddBaseController"
        })


        //作品列表
        .state("main.case-list", {
            url: "/case-list",
            templateUrl: "/templates/center/case/case-list.html",
            controller:"CaseListController"
        })


        //新增作品part1
        .state("main.case-add-p1", {
            url: "/case-add-p1",
            templateUrl: "/templates/center/case/case-add-p1.html",
            controller:"CaseAddOneController"
        })

        //新增作品part2
        .state("main.case-add-p2", {
            url: "/case-add-p2",
            templateUrl: "/templates/center/case/case-add-p2.html",
            controller:"CaseAddSecController"
        })

        //新增作品part3
        .state("main.case-add-p3", {
            url: "/case-add-p3",
            templateUrl: "/templates/center/case/case-add-p3.html",
            controller:"CaseAddTrdController"
        })
        //新增作品part4
        .state("main.case-add-p4", {
            url: "/case-add-p4",
            templateUrl: "/templates/center/case/case-add-p4.html",
            controller:"CaseAddFourController"
        })

        //作品详情
        .state("main.case-info", {
            url: "/case-info",
            templateUrl: "/templates/center/case/case-info.html",
            controller:"CaseInfoController"
        })

        //客户列表
        .state("main.customer", {
            url: "/customer",
            templateUrl: "/templates/center/customer/customer-list.html",
            controller:"CustomerListController"
        })

        //会话管理列表
        .state("main.im-list", {
            url: "/im-list",
            templateUrl:"/templates/center/im/im-list.html",
            controller:"imListController"
        })

        //会话信息
        .state("main.im-list-info", {
            url: "/im-list-info",
            templateUrl:"/templates/center/im/im-list-info.html",
            controller:"imListInfoController"
        })



        //品牌列表
        .state("main.brand", {
            url: "/brand",
            templateUrl:"/templates/center/brand/brand-list.html",
            controller:"BrandListController"
        })

        //品牌添加
        .state("main.brand-add", {
            url: "/brand-add",
            templateUrl:"/templates/center/brand/brand-add.html",
            controller:"BrandAddController"
        })

        //管理员列表
        .state("main.manager", {
            url: "/manager",
            templateUrl:"/templates/center/manager/manager-list.html",
            controller:"ManagerListController"
        })

        //管理员添加
        .state("main.manager-add", {
            url: "/manager-add",
            templateUrl:"/templates/center/manager/manager-add.html",
            controller:"ManagerAddController"
        })

        //反馈列表
        .state("main.feedback", {
            url: "/feedback",
            templateUrl:"/templates/center/feedback/feedback-list.html",
            controller:"FeedBackController"
        })

        //活动列表
        .state("main.activity", {
            url: "/activity-list",
            templateUrl:"/templates/center/activity/activity-list.html",
            controller:"ActivityListController"
        })
        //添加活动
        .state("main.activity-add", {
            url: "/activity-list-add",
            templateUrl:"/templates/center/activity/activity-add.html",
            controller:"ActivityAddController"
        })
        //添加活动 楼盘活动
        .state("main.activity-add-building", {
            url: "/activity-list-add-building",
            templateUrl:"/templates/center/activity/activity-add-building.html",
            controller:"ActivityAddBuildingController"
        })
        //活动详情-公司列表-公司详情
        .state("main.activity-company-info", {
            url: "/activity-list-company-info",
            templateUrl:"/templates/center/activity/activity-list-info-company.html",
            controller:"ActivityCompanyInfoController"
        })

        //活动详情-公司列表-公司详情-基本信息
        .state("main.activity-company-info.business-basic", {
            url: "/business-basic",
            templateUrl: "/templates/center/business/business-basic.html",
            controller:"BusinessBasicController"
        })

        //添加报名列表
        .state("main.activity-join", {
            url: "/activity-list-join",
            templateUrl:"/templates/center/activity/activity-join.html",
            controller:"ActivityJoinListController"
        })

        //活动列表-活动详情(楼盘活动)
        .state("main.activity-list-info", {
            url: "/activity-list-info",
            templateUrl:"/templates/center/activity/activity-list-info.html",
            controller:"ActivityListInfoController"
        })

        //活动列表-活动详情(楼盘活动)-活动中奖宣传-新增/查看/修改
        .state("main.activity-list-prize-publicity", {
            url: "/activity-list-prize-publicity",
            templateUrl:"/templates/center/activity/activity-list-prize-publicity.html",
            controller:"PrizePublicityController"
        })






        //客户详情
        .state("main.customer-info", {
            url: "/customer-info",
            templateUrl: "/templates/center/customer/customer-info.html",
            controller:"CustomerInfoController"
        })

        //客户详情-基本信息
        .state("main.customer-info.customer-basic", {
            url: "/customer-basic",
            templateUrl: "/templates/center/customer/customer-basic.html",
            controller:"CustomerBasicController"
        })

        //客户详情-房屋信息
        .state("main.customer-info.customer-house", {
            url: "/customer-house",
            templateUrl: "/templates/center/customer/customer-house.html",
            controller:"CustomerHouseController"
        })

        //客户详情-账单列表
        .state("main.customer-info.customer-bill-list", {
            url: "/customer-bill-list",
            templateUrl: "/templates/center/customer/customer-bill-list.html",
            controller:"CustomerBillController"
        })

        //客户详情-账单列表
        .state("main.customer-info.customer-info-step", {
            url: "/customer-info-step",
            templateUrl: "/templates/center/customer/customer-info-step.html",
            controller:"CustomerStepController"
        })


        //客户对应账户资金列表
        .state("main.customer-info.account-flow", {
            url: "/account-flow",
            templateUrl: "/templates/center/customer/account-flow.html",
            controller:"AccountFlowListController"
        })

        //客户对应订单列表
        .state("main.customer-info.order-list", {
            url: "/customer-order-list",
            templateUrl: "/templates/center/customer/customer-order-list.html",
            controller:"CustomerOrderListController"
        })

        //客户对应退款列表
        .state("main.customer-info.refund-list", {
            url: "/customer-refund-list",
            templateUrl: "/templates/center/customer/customer-refund-list.html",
            controller:"CustomerRefundListController"
        })


        //站内信
        .state("main.mail-list", {
            url: "/mail-list",
            templateUrl:"/templates/center/mail/mail-list.html",
            controller:"MailController"
        })



        //资金账户
        .state("main.order-account", {
            url: "/order-account",
            templateUrl: "/templates/center/order/order-account.html",
            controller:"OrderAccountController"
        })

        //订单服务内容
        .state("main.order-phase", {
            url: "/order-phase",
            templateUrl: "/templates/center/order/order-phase.html",
            controller:"OrderPhaseController"
        })









		//推客团队-结佣清单
		.state("main.twitter-team-commission-list", {
           	url:"/twitter-team-commission-list",
            templateUrl:"/templates/center/twitter/twitter-team-commission-list.html",
            controller:"TwitterTeamCommissionController"
        })

		//推客团队-团队列表
		.state("main.twitter-team-list", {
           	url:"/twitter-team-list",
            templateUrl:"/templates/center/twitter/twitter-team-list.html",
            controller:"TwitterTeamListController"
        })
		//推客团队-团队详情
        .state("main.twitter-team-list-info", {
            url:"/twitter-team-list-info",
            templateUrl:"/templates/center/twitter/twitter-team-list-info.html",
            controller:"TwitterTeamListInfoController"
        })
        //推客团队-新增团队/修改团队type=1 新增 2=修改
        .state("main.twitter-team-list-edit", {
            url:"/twitter-team-list-edit",
            templateUrl:"/templates/center/twitter/twitter-team-list-edit.html",
            controller:"TwitterTeamEditController"
        })









        //推客列表
        .state("main.twitter-list", {
            url:"/twitter-list",
            templateUrl:"/templates/center/twitter/twitter-list.html",
            controller:"TwitterListController"
        })

        //推客申请列表v1.11.0隐藏了
        .state("main.twitter-apply-list", {
            url:"/twitter-apply-list",
            templateUrl:"/templates/center/twitter/twitter-apply-list.html",
            controller:"TwitterApplyListController"
        })

        //推客申请列表详情v1.11.0隐藏了
        .state("main.twitter-apply-list-info", {
            url:"/twitter-apply-list-info",
            templateUrl:"/templates/center/twitter/twitter-apply-list-info.html",
            controller:"TwitterApplyListInfoController"
        })


        //推客的客户列表
        .state("main.twitter-ctr-list", {
            url:"/twitter-ctr-list",
            templateUrl:"/templates/center/twitter/twitter-customer-list.html",
            controller:"TwitterCustomerListController"
        })

        //推客的客户列表详情
        .state("main.twitter-ctr-list-info", {
            url:"/twitter-ctr-list-info",
            templateUrl:"/templates/center/twitter/twitter-customer-list-info.html",
            controller:"TwitterCustomerListInfoController"
        })

        //推客进展详情
        .state("main.twitter-ctr-list-show", {
            url:"/twitter-ctr-list-show",
            templateUrl:"/templates/center/twitter/twitter-customer-list-show.html",
            controller:"TwitterListShowController"
        })

         //推客详情
        .state("main.twitter-list-info", {
            url:"/twitter-list-info",
            templateUrl:"/templates/center/twitter/twitter-list-info.html",
            controller:"TwitterListInfoController"
        })


        //优惠券列表
        .state("main.coupon-list", {
            url:"/coupon-list",
            templateUrl:"/templates/center/coupon/coupon-list.html",
            controller:"CouponListController"
        })

        //新增优惠券
        .state("main.coupon-list-add", {
            url:"/coupon-list-add",
            templateUrl:"/templates/center/coupon/coupon-list-add.html",
            controller:"CouponListAddController"
        })

        //优惠券详情
        .state("main.coupon-list-info", {
            url:"/coupon-list-info",
            templateUrl:"/templates/center/coupon/coupon-list-info.html",
            controller:"CouponListInfoController"
        })


        //推客设置
        .state("main.twitter-set", {
            url:"/twitter-set",
            templateUrl:"/templates/center/twitter/twitter-set.html",
            controller:"TwitterSetController"
        })

        //评论列表
        .state("main.case-comment", {
            url:"/case-comment",
            templateUrl:"/templates/center/case/case-comment.html",
            controller:"CaseCommentController"
        })

        //账单列表
         .state("main.bill-list", {
             url: "/bill-list",
             templateUrl: "/templates/center/bill/bill-list.html",
             controller:"BillListController"
         })

         //账单资金账户
         .state("main.bill-account", {
             url: "/bill-account",
             templateUrl: "/templates/center/bill/bill-account.html",
             controller:"BillAccountController"
         })

        //楼盘列表
        .state("main.building-list", {
            url:"/building-list",
            templateUrl:"/templates/center/building/building-list.html",
            controller:"buildingListController"
        })

        //新增楼盘
        .state("main.building-add", {
            url:"/building-list-add",
            templateUrl:"/templates/center/building/building-add.html",
            controller:"buildingAddController"
        })

        //订单列表
        .state("main.orders-list", {
            url:"/orders-list",
            templateUrl:"/templates/center/orders/order-list.html",
            controller:"ordersListController"
        })
        //订单详情
        .state("main.orders-info", {
            url:"/orders-list-info",
            templateUrl:"/templates/center/orders/order-info.html",
            controller:"ordersInfoController"
        })
        //订单列表
        .state("main.jl-orders", {
            url:"/jl-orders",
            templateUrl:"/templates/center/orders/jl-order.html",
            controller:"jlOrdersListController"
        })
        //订单详情
        .state("main.jl-orders-info", {
            url:"/jl-orders-info",
            templateUrl:"/templates/center/orders/jl-order-info.html",
            controller:"jlOrdersInfoController"
        })
        //家居顾问列表
        .state("main.decorate-sell-list", {
            url:"/decorate-sell-list",
            templateUrl:"/templates/center/decorate-sell/decorate-sell-list.html",
            controller:"decorateSellListController"
        })
        //添加家居顾问
        .state("main.decorate-sell-create", {
            url:"/decorate-sell-list-create",
            templateUrl:"/templates/center/decorate-sell/decorate-sell-create.html",
            controller:"decorateSellCreateController"
        })
        //家居顾问基本
        .state("main.d-s-info", {
            url:"/decorate-sell-list-info",
            templateUrl:"/templates/center/decorate-sell/d-s-info.html",
            controller:"decorateSellInfoController"
        })
        //家居顾问-推客
        .state("main.d-s-twitter", {
            url:"/decorate-sell-list-twitter",
            templateUrl:"/templates/center/decorate-sell/d-s-twitter.html",
            controller:"decorateSellTwitterController"
        })
        //家居顾问-客户
        .state("main.d-s-customer", {
            url:"/decorate-sell-list-customer",
            templateUrl:"/templates/center/decorate-sell/d-s-customer.html",
            controller:"decorateSellCustomerController"
        })
        //家居顾问-会话
        .state("main.d-s-im", {
            url:"/decorate-sell-list-im",
            templateUrl:"/templates/center/decorate-sell/d-s-im.html",
            controller:"decorateSellImController"
        })

        //家居顾问-订单
        .state("main.d-s-order", {
            url:"/decorate-sell-list-order",
            templateUrl:"/templates/center/decorate-sell/d-s-order.html",
            controller:"decorateSellOrderController"
        })

        //主材管理-列表
        .state("main.material-list", {
            url:"/material-list",
            templateUrl:"/templates/center/material/material-list.html",
            controller:"materialListController"
        })
        //主材管理-门店列表
        .state("main.material-list-stores", {
            url:"/material-list-stores",
            templateUrl:"/templates/center/material/material-list-stores.html",
            controller:"materialListStoresController"
        })

        //主材管理-门店列表-新增门店
        .state("main.material-list-stores-add", {
            url:"/material-list-stores-add",
            templateUrl:"/templates/center/material/material-list-stores-add.html",
            controller:"materialListStoresAddController"
        })

        //主材管理-爆款列表
        .state("main.material-list-goods", {
            url:"/material-list-goods",
            templateUrl:"/templates/center/material/material-list-goods.html",
            controller:"materialListGoodsController"
        })





        //主材管理-添加/修改
        .state("main.material-list-add", {
            url:"/material-list-add",
            templateUrl:"/templates/center/material/material-add.html",
            controller:"materialAddController"
        })

        //主材管理-推荐主材
        .state("main.material-push-list", {
            url:"/material-push-list",
            templateUrl:"/templates/center/material/material-push-list.html",
            controller:"materialPushController"
        })

        //主材管理-定金主材
        .state("main.material-pay-list", {
            url:"/material-pay-list",
            templateUrl:"/templates/center/material/material-pay-list.html",
            controller:"materialPayController"
        })


        //主材管理-用户操作日志
        .state("main.material-log", {
            url:"/material-log",
            templateUrl:"/templates/center/material/material-log.html",
            controller:"mLogListController"
        })



        //监理公司-列表
        .state("main.jl-company-list", {
            url:"/jl-company-list",
            templateUrl:"/templates/center/business/jl-company-list.html",
            controller:"jscListController"
        })

        //监理公司-列表-新增/修改
        .state("main.jl-company-list-add", {
            url:"/jl-company-list-add",
            templateUrl:"/templates/center/business/jl-company-list-add.html",
            controller:"jscListAddController"
        })
        //监理公司-列表-详情
        .state("main.jl-company-list-info", {
            url:"/jl-company-list-info",
            templateUrl:"/templates/center/business/jl-company-list-info.html",
            controller:"jscListInfoController"
        })


        //广告管理-列表
        .state("main.a-d-list", {
            url:"/a-d-list",
            templateUrl:"/templates/center/a-d/a-d-list.html",
            controller:"adListController"
        })
        //广告管理-新增/修改
        .state("main.a-d-list-add", {
            url:"/a-d-list-add",
            templateUrl:"/templates/center/a-d/a-d-list-add.html",
            controller:"adListAddController"
        })
        //快捷收款
        .state("main.fast-pay", {
            url:"/fast-pay",
            templateUrl:"/templates/center/fastpay/fast-pay-list.html",
            controller:"fastPayListController"
        })

        //拼团管理列表
        .state("main.groupbuy-list", {
            url:"/groupbuy-list",
            templateUrl:"/templates/center/groupbuy/groupbuy-list.html",
            controller:"groupbuyListController"
        })
        //拼团管理新增/修改
        .state("main.groupbuy-list-add", {
            url:"/groupbuy-list-add",
            templateUrl:"/templates/center/groupbuy/groupbuy-list-add.html",
            controller:"groupbuyListAddController"
        })
        //拼团管理详情
        .state("main.groupbuy-list-info", {
            url:"/groupbuy-list-info",
            templateUrl:"/templates/center/groupbuy/groupbuy-list-info.html",
            controller:"groupbuyInfoController"
        })

        //拼团管理详情--团内列表
        .state("main.groupbuy-list-team", {
            url:"/groupbuy-list-team",
            templateUrl:"/templates/center/groupbuy/groupbuy-list-info-team.html",
            controller:"groupbuyInfoTeamController"
        })

        //拼团券管理
        .state("main.groupbuy-coupon", {
            url:"/groupbuy-coupon",
            templateUrl:"/templates/center/groupbuy/groupbuy-coupon.html",
            controller:"groupbuyCouponController"
        })

        //C端首页管理
        .state("main.banner-list", {
            url:"/banner-list",
            templateUrl:"/templates/center/c-banner/banner-list.html",
            controller:"bannerListController"
        })
        // C端首页管理--热门作品推荐
        .state("main.hot-case", {
            url:"/hot-case",
            templateUrl:"/templates/center/c-banner/hot-case.html",
            controller:"hotCaseListController"
        })

        // C端首页管理--询价数据
        .state("main.ask-price", {
            url:"/ask-price",
            templateUrl:"/templates/center/c-banner/ask-price.html",
            controller:"askPriceListController"
        })
        // C端首页管理--询价数据--详情
        .state("main.ask-price-info", {
            url:"/ask-price-info",
            templateUrl:"/templates/center/c-banner/ask-price-info.html",
            controller:"askPriceInfoController"
        })





















        //---数据平台

        //用户趋势
        .state("main.data-user-trend", {
            url:"/data-user-trend",
            templateUrl:"/templates/center/data-user/user-trend.html",
            controller:"DataUserTrendController"
        })

        //用户来源渠道
        .state("main.data-user-source", {
            url:"/data-user-source",
            templateUrl:"/templates/center/data-user/user-source.html",
            controller:"DataUserSourceController"
        })



        //作品类型分布
        .state("main.data-cases-types", {
            url:"/data-cases-types",
            templateUrl:"/templates/center/data-needs/cases-types.html",
            controller:"dataNeedsTypesController"
        })

        //作品数据趋势
        .state("main.data-cases-trend", {
            url:"/data-cases-trend",
            templateUrl:"/templates/center/data-needs/cases-trend.html",
            controller:"dataNeedsTrendController"
        })

        //作品功能使用趋势
        .state("main.data-cases-used", {
            url:"/data-cases-used",
            templateUrl:"/templates/center/data-needs/cases-used.html",
            controller:"dataNeedsUsedController"
        })

        //IM趋势
        .state("main.data-imsg-trend", {
            url:"/data-imsg-trend",
            templateUrl:"/templates/center/data-needs/imsg-trend.html",
            controller:"dataIMTrendController"
        })

        //首页清单
        .state("main.data-lists-default", {
            url:"/data-lists-default",
            templateUrl:"/templates/center/data-lists/data-lists-default.html",
            controller:"dataListsDefaultController"
        })



        //default清单详情列表
        .state("main.data-lists-user", {
            url:"/data-lists-default-user",
            templateUrl:"/templates/center/data-lists/data-list-user.html",
            controller:"dataListsUserController"
        })



        //E端用户清单
        .state("main.data-lists-e", {
            url:"/data-lists-e",
            templateUrl:"/templates/center/data-lists/data-lists-e.html",
            controller:"dataListsEController"
        })



        //E清单详情列表
        .state("main.data-lists-user-e", {
            url:"/data-lists-user-e",
            templateUrl:"/templates/center/data-lists/data-list-user.html",
            controller:"dataListsUserInfoController"
        })


});
