/**
 * API URL
 */
window.pubkey="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBG3UFPAxh+a0NLv6Plvjo5YPDdnlbED8dI4GP21DdFKvXVFcPb0lSRrht5Xrg7ck4PJ/fovfSi7k8MYqPY52g9tnPzkAthVOs99Tw6DVe22vV2hcs7dXvtk+TxKy4IqMjZA77hiH8wMYcJur+o4R770mrVP4fP88x53EQ4PaayQIDAQAB";

window.API = {
    "SYS":{

        "LOGIN":[HOST, "/user/login"].join(""), //登录

        "LOGOUT":[HOST, "/user/logout"].join(""),//退出

        "test":[HOST, "/user/loginText"].join("")  //test

    },
    "COUNT":{
        "COUNT_LIST":[HOST, "/index"].join(""), //统计简报

        "EVERY_DAY_COUNT_ALL":[HOST, "/statistics/brief"].join(""), // GET /statistics/brief 每日统计总数

        "EVERY_DAY_COUNT_LIST":[HOST, "/statistics/daily"].join("") // GET /statistics/daily 每日统计列表


    },
    "COMPANY":{
        "COMPANY_ADD":[HOST, "/company/company/"].join(""),//新增装修商户

        "COMPANY_LIST":[HOST, "/company/search"].join(""),//商户列表

        "COMPANY_ADD_EDIT":[HOST, "/company/company"].join(""),//商户信息修改/完善/新增

        "COMPANY_GET_INFO":[HOST, "/company/"].join(""),//获取商户信息

        "COMPANY_SWITCH_AVAILABLE":[HOST, "/company/"].join(""),//商户的禁用/启用 /company/{id}/switch_available

        "COMPANY_STAFFINC_LIST":[HOST, "/company/"].join(""),//商户所属从业者列表/company/{companyId}/employees

        "COMPANY_CASEINC_LIST":[HOST, "/case/console/"].join(""),//商户所属作品列表/case/console/{companyId}/list

        "COMPANY_CASE_EMPLOYEE_LIST":[HOST, "/employee/"].join(""),//作品所属从业者

        "COMPANY_EMPLOYEE_CONTENT":[HOST, "/employee/"].join(""),//从业者详情

        "COMPANY_AMDIN_LIST":[HOST, "/compOperatorListByComp/"].join(""),//商户管理员列表

        "COMPANY_AMDIN_AUTHORIZE":[HOST, "/compOperatorAuthorize/"].join(""),//商户管理员授权

        "COMPANY_LIST_DEL":[HOST, "/company/"].join(""),//删除列表数据;/company/{companyId}/delete

        "COMPANY_MANAGER_RESET":[window.HOST,"/company/reset/"].join(""),//公司管理员重置密码

        "COMPANY_LISENCE_REQUIRED":[window.HOST,"/company/duplication/businessLicence"].join(""),//营业执照是否存在

        "COMPANY_IDCARD_REQUIRED":[window.HOST,"/company/duplication/idNumber"].join(""),//查询管理员身份证号是否存在

        "COMPANY_ORDER_LIST":[HOST, "/company"].join(""),//公司账单列表 GET /company/{companyid}/order

        "COMPANY_REFUND_LIST":[HOST, "/company"].join(""),//客户退款信息GET /customer/{company}/refundApply

        "COMPANY_JOURNAL":[HOST, "/company"].join(""),//订单流水     GET /customer/{company}/journal

        "COMPANY_ACCOUNT_INFO":[HOST, "/company"].join(""),//公司账户信息（含银行卡等）    GET /company/{companyId}/account

        "COMPANY_APPLY_LIST":[HOST, "/company/joinApply"].join(""),  // 公司入驻的申请列表   GET /company/joinApply

        "COMPANY_APPLY_INFO":[HOST, "/company/joinApply/"].join(""),  // 公司入驻的申请信息 GET /company/joinApply/{applyId}

        "COMPANY_APPLY_AUDIT":[HOST, "/company/joinApply/"].join(""), // 处理公司入驻申请  POST /company/joinApply/{applyId}



        "COMPANY_SERVICE_PHASE":[HOST, "/service/content"].join(""), //查询服务阶段 GET /service/content

        "COMPANY_SERVICE_PHASE_SET":[HOST, "/service/content"].join(""), //新增/ 修改服务阶段 POST  /service/content  |{id}

        "COMPANY_SERVICE_PHASE_GET":[HOST, "/service/content"].join(""), //查询 GET /service/content  |{id}

        "JL_PUB":[HOST, "/company/supervision"].join(""), //监理公司 /company/supervision
    },


    "CUSTOMER":{

        "CUSTOMER_PUB":[HOST, "/customer"].join(""),//公共

        "CUSTOMER_LIST":[HOST, "/customer/customer"].join(""),//显示客户列表

        "CUSTOMER_RESET_PWD":[HOST, "/customer/"].join(""),//重置客户密码

        "CUSTOMER_STATUS":[HOST, "/customer/"].join(""), //客户账号禁用

        "CUSTOMER_INFO":[HOST, "/customer"].join(""),//客户详情 GET /customer/{userId}

        "CUSTOMER_HOUSE_INFO":[HOST, "/customer"].join(""),//房屋信息 GET /customer/{userId}/house

        "CUSTOMER_ORDER_LIST":[HOST, "/customer"].join(""),//客户订单信息 GET /customer/{userId}/order

        "CUSTOMER_REFUND_LIST":[HOST, "/customer"].join(""),//客户退款信息GET /customer/{userId}/refundApply

        "CUSTOMER_JOURNAL":[HOST, "/customer"].join("")//订单流水     GET /customer/{userId}/journal


    },

    "EMPLOYEE":{
        "EMPLOYEE_INOF":[HOST, "/employee/"].join("")//商户所属从业者详情
    },

    "CASE":{
        "CASE_PUB":[HOST, "/case/console"].join(""),//作品公共;

        "CASE_LIST":[HOST, "/case/console/list"].join(""),//作品列表;

        "CASE_LIST_DEL":[HOST, "/case/console/invalidation"].join(""),//删除待完善列表数据;POST /case/console/invalidation/{caseId}

        "CASE_LIST_REASON":[HOST, "/case/console"].join(""),//下架理由 /case/console/{caseId}/queryReason

        "CASE_LIST_DOWN":[HOST, "/case/console/operation/down"].join(""),//下架 POST /case/console/operation/down/{caseId}

        "CASE_LIST_UP":[HOST, "/case/console/operation/up"].join(""),//上架 POST /case/console/operation/up/{caseId}

        "CASE_ADD_PUB_TYPES":[HOST, "/case/console/phase/types"].join(""),//获取常用下拉数据 /case/console/phase/types

        "CASE_ADD_INFO":[HOST, "/case/console/add/basic"].join(""),//添加作品基础信息

        "CASE_UPDATE_INFO":[HOST, "/case/console/update/basic"].join(""),//修改作品基础信息

        "CASE_GET_INFO":[HOST, "/case/console/query/basic"].join(""),//获取作品基础信息,  GET /case/console/query/basic/{caseId}

        "CASE_INFO":[HOST, "/case/console"].join(""),//作品详情 GET /case/console/{caseId}/detail

        "CASE_PASS":[HOST, "/case/console/audit/pass"].join(""),//作品审核通过 POST /case/console/audit/pass/{caseId}

        "CASE_GET_AREA_COMPANY":[HOST, "/case/console/query/companies/"].join(""),//获取区域企业 /case/console/query/companies/{areaId}

        "FORM_720":[HOST, "/case/console/upload/720"].join(""), //720表单上传

        "CASE_GET_MEMBERS":[HOST, "/case/console/members"].join(""),//获取公司团队成员 GET /case/business/members

        "CASE_CASENUM_REQUIRED":[HOST, "/case/console/duplication/caseNum"].join(""),//查询作品编号是否存在

        "CASE_720_PROGRESS":[HOST, "/case/console/upload/progress"].join(""), //720进度条

       "CASE_COMMENT_LIST":[HOST, "/case/"].join(""), // 作品评论  GET /case/{caseId}/comment

        "CASE_COMMENT_AUDIT":[HOST, "/case/"].join(""), // POST /case/{caseId}/comment/status

        "CASE_DRAGSORT_BRAND":[HOST, "/case/console/"].join(""),  // 更改品牌顺序 POST /case/console/{caseId}/caseBrands


        "CASE_GET_TYPES":[HOST, "/case/console/types"].join(""),//获取作品相关信息 GET /case/business/types

        "CASE_CASENAME_REQUIRED":[HOST, "/case/console/duplication/caseName"].join(""),//查询作品名是否存在

        "CASE_GET_AREA_BUILDING":[HOST, "/case/console/query/building"].join(""),//模糊查询楼盘名称 /case/business/query/building/{areaId}/{key}

        "CASE_REJECT_REASON":[HOST, "/case/console/audit/reject"].join(""),//拒绝通过理由 POST /case/console/audit/reject/{caseId}

        "GET_CASE_REJECT_REASON":[HOST, "/case/console"].join(""),//查看拒绝理由 GET /case/console/{caseId}/rejectReason




        /*作品新增相关*/
        "CASE_SET_INFO_P1":[HOST, "/case/console/material/basic"].join(""),//  POST +/add|+/update GET +/id

        "CASE_SET_INFO_P2":[HOST, "/case/console/material/view"].join(""),//  POST +/update GET +/id

        "CASE_SET_INFO_P3":[HOST, "/case/console/material/design"].join(""),//  POST +/update GET +/id

        "CASE_SET_INFO_P4":[HOST, "/case/console/material/construct"].join("")//  POST +/update GET +/id

    },

    IM:{
        "IM_TOKEN":[HOST, "/im/getToken"].join(""), //获取TOKEN

        "IM_PUB":[HOST, "/im/session"].join(""),//IM 公共;
    },

    BRAND:{

        "GET_BRAND_BIG_CLASS":[HOST, "/brand/types"].join(""),//获取品牌大类

        "GET_BRAND_SEC_CLASS":[HOST, "/brand/types"].join(""),//获取品牌二级分类 /brand/types/{typeId}

        "GET_BRAND_INFO":[HOST, "/brand/getByTypes"].join(""),//查询品牌信息/brand/getByTypes

        "ADD_BRAND_INFO":[HOST, "/brand"].join(""),//添加/修改品牌

        "GET_BRAND_LIST":[HOST, "/brand/search"].join(""),//品牌列表/brand/search

        "EDIT_BRAND_INFO":[HOST, "/brand"].join("")//修改指定品牌信息查询 GET /brand/{id}


    },

    MANAGER:{

        "GET_MANAGER_LIST":[HOST, "/user"].join(""),//获取管理员列表 GET

        "SET_MANAGER_AVAILABLE":[HOST, "/user"].join(""),//获取品牌二级分类 /manager/{managerId}/status

        "ADD_MANAGER_INFO":[HOST, "/user"].join("")//添加管理员 POST
    },

    DECORATE:{

        "DECORATE_PUB":[HOST, "/platformemployee"].join(""),//GET /platformemployee //家居顾问

        "DECORATE_TYPES":[HOST, "/platformemployee/enums"].join(""),//GET /platformemployee/enums 常用枚举

        "DECORATE_TWITTER":[HOST, "/platformemployee/relationTwitterList"].join(""),//GET /platformemployee/relationTwitterList//关联推客查询

        "DECORATE_SAVE":[HOST, "/platformemployee/save"].join(""),//POST /platformemployee/save //保存信息

    },

    MATERIAL:{

        "MATERIAL_PUB":[HOST, "/material"].join(""),//GET /material //主材

    },


    OTHER:{
        "QINIU_UPTOKEN":[HOST, "/upload/getToken"].join(""),//七牛上传token

        "QNV_UPTOKEN":[HOST, "/upload/getVideoToken"].join(""),//七牛上传视频

        "PROVINCE":[HOST, "/area/province"].join(""),//省份

        "CITY":[HOST, "/area/city"].join(""),//城市

        "COUNTY":[HOST, "/area/county"].join(""),//区县

        "GET_AREA":[HOST, "/area"].join(""),//从最后一级反查

        "GET_CITY_OWN":[HOST, "/area/citySupport"].join(""),   // GET /area/citySupport //平台指定的城市


        "GET_BRAND_BY_BIGCLASS":[HOST, "/brand/collection"].join("") //GET /brand/collection?typeId=1获取指定大类的品牌及子类
    },

    FEEDBACK: {
        "FEEDBACK_LIST":[HOST, "/user/feedback"].join("") //反馈列表
    },
    ACTIVITY: {

        "ACTIVITY_LIST":[HOST, "/activity"].join(""), //活动列表

        "ACTIVITY_TYPES":[HOST, "/activity/enums"].join(""), // 获取常用活动枚举  GET

        "ACTIVITY_DEL":[HOST, "/activity"].join(""), // 删除活动 POST /activity/{activityid}/delete

        "ACTIVITY_UP":[HOST, "/activity"].join(""), // 上架活动   POST /activity/{activityId}/status?onSale=true

        "ACTIVITY_DOWN":[HOST, "/activity"].join(""), // 下架活动  POST /activity/{activityid}/status?onSale=false

        "ACTIVITY_JOIN_LIST":[HOST, "/activity"].join(""), // 报名列表   GET /activity/{activityId}/customer

        "ACTIVITY_COUPON_USE":[HOST, "/activity/coupon/use"].join(""), // 签到    POST /activity/coupon/use

        "ACTIVITY_INFO":[HOST, "/activity"].join(""), //活动详情 GET /activity/{activityid}

        "ACTIVITY_SAVE":[HOST, "/activity"].join(""), //添加/修改活动 修改基于表单ID

        "ACTIVITY_GET_CASES":[HOST, "/activity"].join(""), //GET /activity/{activityId}/cases 查询预案

        "ACTIVITY_DO_CASES":[HOST, "/activity"].join(""), //POST|GET /activity/{activityId}/{buildingId}/{layoutId}/cases 添加|修改|查询已选活动和楼盘的预案

        "ACTIVITY_DETAILS":[HOST,"/activity"].join(""),//GET /activity/{activityId} v1.14.0 lf 查询活动详细信息

        "ACTIVITY_AWARD_PROGRESS":[HOST,"/activity/award/progress"].join(""),   //POST /activity/award/progress v1.14.0 *lf 添加和修改大奖进度公示
                                                                                //GET /activity/award/progress v1.14.0 *lf 查看大奖进度公示

        "ACTIVITY_PROPAGANDA_LIST":[HOST,"/activity"].join(""),   //GET /activity/{activityId}/propagandaList v1.14.0 *lf 查看中奖宣传列表
        
        "ACTIVITY_AWARD_PROPAGANDA":[HOST,"/activity/award/propaganda"].join(""), //GET /activity/award/propaganda v1.14.0 *lf 查看活动中奖宣传
                                                                                //POST /activity/award/propaganda v1.14.0 *lf 添加和修改活动中奖宣传

        "ACTIVITY_DELETE_PROPAGANDA":[HOST,"/activity/delete/propaganda"].join(""), //POST /activity/delete/propaganda v1.14.0 *lf 删除活动中奖宣传

        "ACTIVITY_ENROLLLIST":[HOST,"/activity"].join(""),//GET /activity/{activityId}/enrollList v1.14.0 *lf 查看报名列表

        "ACTIVITY_CONTRACT":[HOST,"/activity"].join(""),        //GET /activity/{enrollId}/contract v1.14.0 *lf 查看和审核时获取合同图片信息
                                                                //POST /activity/{enrollId}/changeToAgree v1.14.0 *lf 将待审核的合同信息转为通过
                                                                //POST /activity/{enrollId}/changeToDisagree v1.14.0 *lf 将已通过的的合同信息转为待审核

        "ACTIVITY_ENROLLINFO":[HOST,"/activity"].join(""),        //GET /activity/{enrollId}/enrollInfo v1.14.0 *lf 查看报名详情
    },

    MAIL: {
        "MAIL_LIST":[HOST, "/im/internalMessage"].join("") // 查询站内信列表
    },

    "ORDERS":{

        "ORDER_TYPES":[HOST, "/order/enums"].join(""),//订单枚举GET /order/enums

        "ORDER_LIST":[HOST, "/order"].join(""),//订单列表 get /order

        "ORDER_INFO":[HOST, "/order"].join(""),//详情   GET /order/{orderId}

        "ORDER_EDIT_CUSTOMER":[HOST, "/order"].join(""),//提交编辑用户信息     POST /order/{orderId}/customer

        "ORDER_STOP":[HOST, "/order"].join(""),//终止订单     POST /order/{orderId}/status

        "ORDER_BILL":[HOST, "/order"].join(""),//账单列表      GET /order/{orderId}/bill

        "ORDER_PAYLOG":[HOST, "/order"].join(""),//打款记录      GET /order/{orderId}/{billId}/journal

        "ORDER_COUPONS":[HOST, "/coupon/userCoupon"].join(""),//用户优惠券详情    GET /coupon/userCoupon/{userCouponId}

        "ORDER_DO_LOG":[HOST, "/order"].join(""),// 操作日志    GET /order/{orderId}/log

        "ORDER_TRANSFER":[HOST, "/order"].join(""),// 打款记录|新增打款金额 POST|GET /order/{orderId}/transfer

        "ORDER_COUNT":[HOST, "/order"].join(""),// 订单金额统计 GET /order/{orderId}/transfer/statistics

    },

    "ACCOUNT":{
        "ACCOUNT":[HOST, "/account"].join(""), // M端资金账户

        "ACCOUNT_RECHARGE":[HOST, "/account/capital/recharge"].join(""), // 账户充值 POST /account/capital/recharge

        "ACCOUNT_JOURNAL":[HOST, "/account/journals"].join(""), //  账户流水 GET /account/journals
    },

    "TWITTER":{
        "TWITTER_LIST":[HOST,"/twitter"].join(""), // 推客列表

        "TWITTER_ENUMS":[HOST, "/twitter/enums"].join(""), // 获取推客相关的枚举定义 GET /twitter/enums

        "TWITTER_INFO":[HOST, "/twitter"].join(""), // 查询推客详情 GET /twitter/twitterId

        "TWITTER_AUTH":[HOST, "/twitter/"].join(""), // 推客认证 POST /twitter/{twitterId}/auth

        "TWITTER_GET_SET":[HOST, "/twitter/revenueConfig"].join(""), // 获取推客设置信息 GET /twitter/revenueConfig

        "TWITTER_SAVE_SET":[HOST, "/twitter/revenueConfig"].join(""),//保存推客设置信息 post /twitter/revenueConfig

        "TWITTER_APPLY_LIST":[HOST, "/twitter/application/application"].join(""),// 申请推客列表

        "TWITTER_PAY_LIST":[HOST, "/twitter/transfers"].join(""),//  GET /twitter/transfers/{twitterId} 推客详情--打款记录

        "TWITTER_ACCOUNT_LAST":[HOST, "/twitter/account"].join(""),// GET /twitter/account/{twitterId} 查询余额

        "TWITTER_PAY_LIST_ADD":[HOST, "/twitter/transfers"].join(""),//  POST /twitter/transfers/{twitterId} 添加记录

        "TWITTER_CUS_LIST":[HOST, "/twitterCustomer"].join(""),//  GET /twitterCustomer 推客客户

        "TWITTER_CUS_TYPES":[HOST, "/twitterCustomer/types"].join(""),//  GET /twitterCustomer 常用枚举

        "TWITTER_CUS_STEP_LIST":[HOST, "/twitterCustomer/relation"].join(""),//   GET /twitterCustomer/relation/{twitterCustomerId}  节点信息列表

        "TWITTER_CUS_STEP_ACCOUNT":[HOST, "/twitterCustomer/procedure"].join(""),//   GET /twitterCustomer/procedure/{procedureId}/signSettle  查询结佣金额方式等

        "TWITTER_CUS_STEP_INFO":[HOST, "/twitterCustomer/procedure"].join(""),//  GET /twitterCustomer/procedure/{procedureId} 查询节点详情

        "TWITTER_CUS_STEP_ADD":[HOST, "/twitterCustomer/procedure/addition"].join(""),//    POST /twitterCustomer/procedure/addition 新增节点

        "TWITTER_CUS_STEP_EDIT":[HOST, "/twitterCustomer/procedure/evolve"].join(""),//    POST /twitterCustomer/procedure/evolve/{procedureId} 更新节点

        "TWITTER_GET_COMPANY":[HOST, "/company/companies"].join(""),//    GET /company/companies 模糊查找公司

        "TWITTER_CUS_STEP_DEL":[HOST, "/twitterCustomer/procedure/remove"].join(""),//     POST /twitterCustomer/procedure/remove/{procedureId} 删除节点

        "TWITTER_APPLY_INFO":[HOST, "/twitter/application/application"].join(""),//      GET /twitter/application/application/{applyId}推客申请详情

        "TWITTER_APPLY_CHECK":[HOST, "/twitter/application/auditing"].join(""),//      POST /twitter/application/auditing 审核认证

        "TWITTER_CHILD_LIST":[HOST, "/twitter/branches"].join(""), //     GET /twitter/branches/{twitterId} 发展线下

        "TWITTER_CUSTOMER_LIST":[HOST, "/twitter/customers"].join(""),//    GET /twitter/customers/{twitterId} 推客客户列表

        "TWITTER_ISABLED":[HOST, "/twitter"].join(""), //   POST /twitter/{twitterId}/available 启用禁用推客

        "TWITTER_REMARKS":[HOST, "/twitter"].join(""), //   GET /twitter/{twitterId}/remarks 获取推客备注  //POST  /twitter/{twitterId}/remarks?remarks=123

		"TWITTER_TRANSFERS":[HOST,"/twitter/transfers"].join(""), //POST /twitter/transfers/{twitterId} 新增结拥记录

		/*推客团队*/
		"TWITTER_TEAM_ENUMS":[HOST,"/twitter/team/enums"].join(""), //GET 推客团队支付方式枚举//GET /twitter/team/enums

		"TWITTER_TEAM":[HOST,"/twitter/team"].join(""), //GET 推客团队列表

		"TWITTER_TEAM_TWITTERTEAM":[HOST,"/twitter/team/twitterTeam"].join(""), //POST 新增团队、修改团队/twitter/team/twitterTeam

		"TWITTER_TEAM_REMARKS":[HOST,"/twitter/team"].join(""), //GET/POST 推客团队列表-备注/twitter/team/{teamId}/remarks

		"TWITTER_TEAM_AVAILABLE":[HOST,"/twitter/team"].join(""), //POST 推客团队列表-启用/禁用// /twitter/team/12/available?available=true

		"TWITTER_TEAM_DETAILLIST":[HOST,"/twitter/team/detailList"].join(""), //GET 推客团队-结佣清单

		"TWITTER_TEAM_DETAILLIST_TOTAL":[HOST,"/twitter/team/detailList/total"].join(""),	//GET推客团队-结佣清单-获取总金额 /twitter/team/detailList/total

		"TWITTER_TEAM_TWITTERTEAMINFO":[HOST,"/twitter/team"].join(""), //GET 推客团队-团队详情-基本信息//twitter/team/123/twitterTeamInfo

		"TWITTER_TEAM_TWITTERTEAMUSERLIST":[HOST,"/twitter/team"].join(""), //GET 推客团队-团队详情-所属推客/twitter/team/{teamId}/twitterTeamUserList

		"TWITTER_TEAM_RELATIONTWITTERLIST":[HOST,"/twitter/team/relationTwitterList"].join(""),//GET /twitter/team/relationTwitterList

		"TWITTER_TEAM_RELATIONTWITTER":[HOST,"/twitter/team"].join(""),//POST /twitter/team/{teamId}/relationTwitter

		"TWITTER_TEAM_TRANSFERS":[HOST,"/twitter/team/transfers"].join(""),//GET/POST推客团队-团队详情-结佣记录/新增结佣记录 /twitter/team/transfers/{teamId}

		"TWITTER_TEAM_ACCOUNT":[HOST,"/twitter/team/account"].join(""), //GET推客团队-团队详情-结佣记录/查询待结佣金额  GET /twitter/team/account/{teamId}

    },
    "COUPON":{

        "COUPON_LIST":[HOST, "/coupon"].join(""),// GET /coupon 优惠券列表

        "COUPON_SAVE":[HOST, "/coupon"].join(""), // POST /coupon 新增/修改优惠券

        "COUPON_TYPES":[HOST, "/coupon/enums"].join(""),//  GET /coupon/enums 查询枚举

        "COUPON_INFO":[HOST, "/coupon"].join(""), //  GET /coupon/{couponId} 查询优惠券

        "COUPON_DEL":[HOST, "/coupon"].join("") //   POST /coupon/{couponId}/disable 删除优惠券

    },

    "BUILDING": {
        "BUILDING_LIST": [HOST, "/building"].join(""), // 楼盘列表

        "BUILDING_SAVE": [HOST, "/building"].join(""), //POST /building 保存/修改楼盘信息

        "BUILDING_TYPES": [HOST, "/building/enums"].join(""), //GET /building/enums 相关枚举

        "BUILDING_DEL": [HOST, "/building"].join(""), //post /building/{buildingId}/delete 删除楼盘

        "BUILDING_GET_INFO": [HOST, "/building"].join(""), //GET /building/{buildingId} 获取楼盘信息

        "BUILDING_ROOMS_SAVE": [HOST, "/building"].join(""), //POST /building/{buildingId}/layout 修改/添加楼盘信息

        "BUILDING_ROOMS_GET_INFO": [HOST, "/building"].join(""), // GET /building/{buildingId}/layout/{layoutId}  查询具体楼盘户型

        "BUILDING_ROOMS_DEL": [HOST, "/building"].join(""), //POST /building/{buildingId}/layout/{layoutId}/delete  删除户型
    },


    "BILL": {
        "BILL_LIST": [HOST, "/bill/items"].join(""), //账单列表 GET /bill/items

        "COMPANY_BILL_LIST": [HOST, "/bill/items/company/"].join(""),  //公司账单列表 GET /bill/items/company/{companyId}

        "CUSTOMER_BILL_LIST": [HOST, "/bill/items/customer/"].join(""),  //客户账单列表 GET /bill/items/customer/{userId}

        "BILL_TYPES": [HOST, "/bill/types"].join(""), // 查询账单枚举 GET /bill/types

        "BILL_CONFIRM": [HOST, "/bill/confirmOfflineTransfer/"].join(""), // 确认线下打款

        "BILL_BRIEF": [HOST, "/bill/brief/"].join("") // 账单简要信息
    },

    "ADVTS": {
        "AD": [HOST, "/a-d_verts"].join("") // 广告模块
    },
    "FASTPAY": {
        "LIST": [HOST, "/pos/user"].join("") //用户列表
    },
    "GROUPBUY": {
        "GROUPBUY_PUB": [HOST, "/group"].join("") //拼团
    },
    "BANNER": {
        "BANNER_PUB": [HOST, "/banner"].join("") //C端首页管理--banner
    },
    "HOTCASE": {
        "HOTCASE_PUB": [HOST, "/hotCase"].join("") //C端首页管理--热门作品
    },
    "FREEQUOTE": {
        "FREEQUOTE_PUB": [HOST, "/freeQuote"].join("") //C端首页管理--询价用户数据
    },





    "DTATCOUNT":{

        "SEARCH_TYPES": [HOST, "/statistics/enums"].join(""), //统计通用枚举 GET /statistics/enums

        "DTATCOUNT_USER_TREND": [HOST, "/statistics/customer/tendency"].join(""),//查询C端用户数据趋势统计  GET /statistics/customer/tendency

        "DTATCOUNT_USER_SOURCE": [HOST, "/statistics/customer/source"].join(""),//查询C端用户来源渠道统计(数据全部来源于友盟)  GET /statistics/customer/source

        "DTATCOUNT_CASE_TYPES": [HOST, "/statistics/case/decorateType"].join(""),//查询作品装修类型统计   GET /statistics/case/decorateType

        "DTATCOUNT_CASE_TREND": [HOST, "/statistics/case/tendency"].join(""),//查询作品数据趋势统计     GET /statistics/case/tendency

        "DTATCOUNT_CASE_USED": [HOST, "/statistics/case"].join(""), //查询作品(造价/风格/房型)统计  GET /statistics/case

        "DTATCOUNT_CASE_USED_IM_TREND": [HOST, "/statistics/im/tendency"].join(""), //查询IM会话数据趋势统计  GET /statistics/im/tendency

        "DTATCOUNT_SIM_INFO": [HOST, "/statistics/general"].join(""), //统计简报  GET /statistics/general

        "DTATCOUNT_E_SIM_LIST": [HOST, "/statistics/employee"].join(""), //E端用户简报   GET /statistics/employee

        "DTATCOUNT_E_USER_LIST": [HOST, "/statistics/employee/infos"].join(""), //E端用户简报>详情列表  GET /statistics/employee/infos

































    }

};
