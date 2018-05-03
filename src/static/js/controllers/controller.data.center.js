/**
 *
 *基础数据服务
 */

/*echarts 基础数据*/
sysController.factory("chartOpt",[function(){
    return function(c,l,x){
        var option = {
            title: { text: '' },
           // color: c||[],
            tooltip: {trigger: 'axis' },
            grid: { right: '8%',left: '8%' },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: true},//readOnly 可以实时修改数据
                    saveAsImage: {show: true}
                },
                itemSize:15,
                orient:"horizontal", //可选项为“horizontal”和“vertical”
                itemGap:10

            },
            legend: {
                data:l||[]
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {alignWithLabel: true},
                    data: x||[]
                }
            ]
        };
        return  option;
    }

}]);


/*常用查询枚举*/
sysController.factory("searchTypesSer", ["$http", function( $http ){
    return function(scope,getUrl){
        /*获取常用枚举*/
        $http.get([getUrl].join("")).success(function(res){
            if(res.stateCode===0){
                scope.phoneSystemTypes=res.data.phoneSystemTypes;//设备枚举
                scope.timeRangeTypes=res.data.timeRangeTypes; //日期类型枚举
                scope.timeSearchTypes=res.data.timeSearchTypes;//日期单位枚举
                scope.orderbyTypes=res.data.orderbyTypes;//排序字段
            }
        });
    }
}]);



/**
 *
 *数据平台 > 首页 > 概况清单
 */

sysController.controller("dataListsDefaultController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);


        /*查询结果*/
        $scope.submitSearch=function(dt){
            var serKey=angular.copy(dt)||{};
            if(serKey.timeRangeType===1){ //自定义时间
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
                serKey.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                serKey.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            }
            if($scope.dateThan&&serKey.timeRangeType===1){
                return false
            }else{
                $scope.dateThan=""
            }

            $scope.getChartsView(serKey)

        };


        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?timeRangeType=",kw.timeRangeType,"&beginTime=",kw.beginTime,"&endTime=",kw.endTime].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_SIM_INFO,query].join("")).success(function(res){

                if(!res.stateCode){
                    $scope.dataInfo=res.data;

                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView()

    }]);



/**
 *
 *
 *数据平台 > C端用户数据 > 用户数据趋势
 */

 sysController.controller("DataUserTrendController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {

        /*初始化数据*/
        var $$=function(q){return document.querySelector(q)};
        var EC=echarts.init($$("#myCharts"),"macarons");
        angular.element(window).resize(function(){ EC.resize();});


        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);

        /*初始数据*/
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        var legend = ['新增用户','注册用户','转化率','活跃用户'];
        var xAxis= [];

        var option = {
            yAxis: [
                {
                    type: 'value',
                    name: '新增&注册用户',
                    //min: 0,
                    //max: 70,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '转化率',
                    //min: 0,
                    //max: 100,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    splitLine:{
                        show:false
                    }
                },
                {
                    type: 'value',
                    name: '活跃用户',
                    //min: 0,
                    //max: 300,
                    position: 'right',
                    offset: 80,
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series: [
                {
                    name:'新增用户',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    },
                },
                {
                    name:'注册用户',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    },
                },
                {
                    name:'转化率',
                    type:'line',
                    yAxisIndex: 1,
                },
                {
                    name:'活跃用户',
                    type:'line',
                    yAxisIndex: 2,
                }
            ]
        };




        /*查询结果*/
        $scope.timeSearchType=1;
        $scope.submitSearch=function(dt,ttype){
            var serKey=angular.copy(dt)||{};
               if(ttype){
                   $scope.timeSearchType=ttype;
               }
            serKey.timeSearchType=$scope.timeSearchType;
            if(serKey.timeRangeType===1){ //自定义时间
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
                serKey.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                serKey.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            }
            if($scope.dateThan&&serKey.timeRangeType===1){
                return false
            }else{
                $scope.dateThan=""
            }

            $scope.getChartsView(serKey)

        };


        /*获取数据*/
        $scope.getChartsView=function(kw){

            var kw=kw||{};
            var query=["?systemType=",kw.systemType||0,"&timeRangeType=",kw.timeRangeType||3,"&beginTime=",kw.beginTime,"&endTime=",kw.endTime,"&timeSearchType=",kw.timeSearchType||1].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_USER_TREND,query].join("")).success(function(res){

                if(!res.stateCode){
                    $scope.support=res.data.support;  //时间类型
                    xAxis=res.data.dateStrList; //时间周期
                    console.log(xAxis)
                    var resData=$.extend(chartOpt(colors,legend,xAxis),option,{});
                    resData.series[0].data=res.data.newCustomerCountList ;  // 新增用户
                    resData.series[1].data=res.data.registerCustomerCountList ;    //注册用户
                    resData.series[2].data=res.data.conversionPercentList;    //转化率
                    resData.series[3].data=res.data.activeCustomerCountList ;    //活跃用户
                    console.log(resData)
                    EC.setOption(resData);
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView();
    }]);




/**
 *
 *数据平台 > C端用户数据 > 用户来源渠道分布
 */

sysController.controller("DataUserSourceController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {

        /*初始化数据*/
        var $$=function(q){return document.querySelector(q)};
        var EC=echarts.init($$("#myCharts"),"macarons");
        angular.element(window).resize(function(){ EC.resize();});
        var opt={};

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);


        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data:['AppStore','华为','阿里','豌豆荚','魅族','小米','百度','应用宝','360','阿里云','今日头条','自有']
            },
            series: [
                {
                    name:'用户来源',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '50%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                },
                {
                    name:'用户来源',
                    type:'pie',
                    radius: ['60%', '80%'],
                }
            ]
        };



        /*查询结果*/
        $scope.submitSearch=function(dt){
            var serKey=angular.copy(dt)||{};
            if(serKey.timeRangeType===1){ //自定义时间
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
                serKey.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                serKey.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            }
            if($scope.dateThan&&serKey.timeRangeType===1){
                return false
            }else{
                $scope.dateThan=""
            }

            $scope.getChartsView(serKey)

        };


        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?systemType=",kw.systemType||0,"&timeRangeType=",kw.timeRangeType,"&beginTime=",kw.beginTime,"&endTime=",kw.endTime,"&timeSearchType=",kw.timeSearchType||1].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_USER_SOURCE,query].join("")).success(function(res){

                if(!res.stateCode){
                    console.log(res)
                    var resData=$.extend(option,{});

                    /*数据转化*/
                    function cutKw(kw){
                        var arr=[];
                        for( var j in kw){
                            var obj ={}
                            obj.value=kw[j]
                            obj.name=j
                            arr.push(obj)
                        }
                        return arr;
                    }

                    resData.title={text:"总计:"+res.data.total};
                    resData.legend.data=res.data.subTypeStrList ;  //渠道名
                    resData.series[0].data=cutKw(res.data.mainTypeCountMap) ;    //作品收藏数列表（友盟数据）
                    resData.series[1].data=cutKw(res.data.subTypeCountMap);    //作品收藏数列表（友盟数据）
                    EC.setOption(resData);
                    console.log(resData)
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView();


    }]);


/**
 *
 *数据平台 > Ｃ端功能数据> 作品类型分布
 */

sysController.controller("dataNeedsTypesController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {

        /*初始化数据*/
        var $$=function(q){return document.querySelector(q)};
        var EC=echarts.init($$("#myCharts"),"macarons");
        angular.element(window).resize(function(){ EC.resize();});
        var option = {
            title:{
                //text: '总计：105'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right'
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie'
                }
            ]
        };

        /*查询结果*/
        $scope.submitSearch=function(dt){
            var serKey=angular.copy(dt)||{};
            $scope.getChartsView(serKey)
        };


        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?caseType=",kw.caseType||0,"&caseStatus=",kw.caseStatus].join("");

            $http.get([$window.API.DTATCOUNT.DTATCOUNT_CASE_TYPES,query].join("")).success(function(res){
                if(!res.stateCode){
                    option.title.text="总计:"+res.data.totalCount;
                    option.legend.data=res.data.decorateTypeList;
                    option.series[0].data=function(){
                        var mapr=res.data.decorateTypeCountMap;
                        var arr=[];
                        for(var k in mapr){
                            var o={};
                            o.value=mapr[k];
                            o.name=k;
                            arr.push(o);
                        }
                        console.log(arr)
                        return arr
                    }();

                    console.log(option)
                    EC.setOption(option);
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView();

    }])


/**
 *
 *数据平台 > Ｃ端功能数据> 数据趋势分布
 */

sysController.controller("dataNeedsTrendController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {


        /*初始化数据*/
        var $$=function(q){return document.querySelector(q)};
        var EC=echarts.init($$("#myCharts"),"macarons");
        angular.element(window).resize(function(){ EC.resize();});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);

        /*初始数据*/
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        var legend = ['浏览数','收藏数','分享数','会话数','订单数'];
        var xAxis= [];

        var option = {

            yAxis: [
                {
                    type: 'value',
                    name: '浏览&收藏&分享数',
                    //min: 0,
                    //max: 700,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '会话&订单数',
                    //min: 0,
                    //max: 50,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine:{
                        show:false
                    }
                },
            ],
            series: [
                {
                    name:'浏览数',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    }
                },
                {
                    name:'收藏数',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    }
                },
                {
                    name:'分享数',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    }
                },
                {
                    name:'会话数',
                    type:'line',
                    yAxisIndex: 1
                },
                {
                    name:'订单数',
                    type:'line',
                    yAxisIndex: 1
                }
            ]
        };



        /*查询结果*/
        $scope.timeSearchType=1;
        $scope.submitSearch=function(dt,ttype){
            var serKey=angular.copy(dt)||{};
            if(ttype){
                $scope.timeSearchType=ttype;
            }
            serKey.timeSearchType=$scope.timeSearchType;
            if(serKey.timeRangeType===1){ //自定义时间
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
                serKey.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                serKey.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            }
            if($scope.dateThan&&serKey.timeRangeType===1){
                return false
            }else{
                $scope.dateThan=""
            }

            $scope.getChartsView(serKey)

        };


        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?systemType=",kw.systemType||0,"&timeRangeType=",kw.timeRangeType||3,"&beginTime=",kw.beginTime,"&endTime=",kw.endTime,"&timeSearchType=",kw.timeSearchType||1].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_CASE_TREND,query].join("")).success(function(res){

                if(!res.stateCode){
                    $scope.support=res.data.support;  //时间类型
                    xAxis=res.data.dateStrList; //时间周期
                    var resData=$.extend(chartOpt(colors,legend,xAxis),option,{});
                    resData.series[0].data=res.data.viewCountList ;  // 作品浏览数列表（友盟数据）
                    resData.series[1].data=res.data.collectedCountList ;    //作品收藏数列表（友盟数据）
                    resData.series[2].data=res.data.shareCountList ;    //作品分享数列表（友盟数据
                    resData.series[3].data=res.data.imCountList ;    //作品会话数列表
                    resData.series[4].data=res.data.orderCountList ;    //作品订单数列表
                    EC.setOption(resData);
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView();



    }]);

/**
 *
 *数据平台 > Ｃ端功能数据> 作品功能使用（风格/房型/造价）
 */

sysController.controller("dataNeedsUsedController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {


        /*初始化数据*/
        var $$=function(q){return document.querySelector(q)};
        var EC=echarts.init($$("#myCharts"),"macarons");
        angular.element(window).resize(function(){ EC.resize();});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);

        /*初始数据*/
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        var legend = ['已上架作品数','未上架作品数','浏览数','筛选数','分享数','收藏数'];
        var xAxis= [];


        var option = {

            yAxis: [
                {
                    type: 'value',
                    name: '作品数',
                    //min: 0,
                    //max: 40,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '浏览数',
                    //min: 0,
                    //max: 1000,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine:{
                        show:false
                    }
                },
                {
                    type: 'value',
                    name: '其它',
                    //min: 0,
                    //max: 100,
                    position: 'right',
                    offset: 80,
                    axisLine: {
                        lineStyle: {
                            color: colors[2]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series: [
                {
                    name:'已上架作品数',
                    type:'bar',
                    stack: '作品数',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    }
                },
                {
                    name:'未上架作品数',
                    type:'bar',
                    stack: '作品数',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    }
                },
                {
                    name:'浏览数',
                    type:'line',
                    yAxisIndex: 1
                },
                {
                    name:'筛选数',
                    type:'line',
                    yAxisIndex: 2
                },
                {
                    name:'分享数',
                    type:'line',
                    yAxisIndex: 2
                },
                {
                    name:'收藏数',
                    type:'line',
                    yAxisIndex: 2
                }
            ]
        };


        /*查询结果*/
        $scope.submitSearch=function(dt){
            var serKey=angular.copy(dt)||{};
            if(serKey.timeRangeType===1){ //自定义时间
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
                serKey.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                serKey.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            }
            if($scope.dateThan&&serKey.timeRangeType===1){
                return false
            }else{
                $scope.dateThan=""
            }

            $scope.getChartsView(serKey)

        };



        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?systemType=",kw.systemType||0,"&statisticsType=",kw.statisticsType||1,"&decorateType=",kw.decorateType,"&timeRangeType=",kw.timeRangeType||3,"&beginTime=",kw.beginTime,"&endTime=",kw.endTime,"&orderType=",kw.orderType||1].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_CASE_USED,query].join("")).success(function(res){

                if(!res.stateCode){
                    xAxis=res.data.typeDescList; //作品房型列表(X轴),
                    var resData=$.extend(chartOpt(colors,legend,xAxis),option,{});
                    resData.series[0].data=res.data.upCountList ;  // 作品上架数列表
                    resData.series[1].data=res.data.notUpCountList ;    //作品未上架数列表
                    resData.series[2].data=res.data.viewCountList ;    //作品浏览数列表（友盟数据）
                    resData.series[3].data=res.data.filtrateCountList ;    //作品筛选数列表（友盟数据）
                    resData.series[4].data=res.data.shareCountList ;    //作品分享数列表（友盟数据）
                    resData.series[5].data=res.data.collectedCountList ;    //作品收藏数列表（友盟数据）
                    EC.setOption(resData);
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView();



    }]);







/**
 *
 *数据平台 > Ｃ端功能数据> 查询IM会话数据趋势统计
 */

sysController.controller("dataIMTrendController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {


        /*初始化数据*/
        var $$=function(q){return document.querySelector(q)};
        var EC=echarts.init($$("#myCharts"),"macarons");
        angular.element(window).resize(function(){ EC.resize();});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);

        /*初始数据*/
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        var legend = ['创建者先说','非会话创建者先说','无人说话'];
        var xAxis= [];

        var option = {
            yAxis: [
                {
                    type: 'value',
                    name: '会话数',
                    //min: 0,
                    //max: 20,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name:'创建者先说',
                    type:'bar',
                    stack: '会话数',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    }
                },
                {
                    name:'非会话创建者先说',
                    type:'bar',
                    stack: '会话数',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    }
                },

                {
                    name:'无人说话',
                    type:'bar',
                    stack: '会话数',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    }
                }
            ]
        };



        /*查询结果*/
        $scope.timeSearchType=1;
        $scope.submitSearch=function(dt,ttype){
            var serKey=angular.copy(dt)||{};
            if(ttype){
                $scope.timeSearchType=ttype;
            }
            serKey.timeSearchType=$scope.timeSearchType;
            if(serKey.timeRangeType===1){ //自定义时间
                $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:true});// 时间判断
                serKey.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
                serKey.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            }
            if($scope.dateThan&&serKey.timeRangeType===1){
                return false
            }else{
                $scope.dateThan=""
            }

            $scope.getChartsView(serKey)

        };




        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?systemType=",kw.systemType||0,"&timeRangeType=",kw.timeRangeType||3,"&beginTime=",kw.beginTime,"&endTime=",kw.endTime,"&timeSearchType=",kw.timeSearchType||1].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_CASE_USED_IM_TREND,query].join("")).success(function(res){

                if(!res.stateCode){
                    $scope.support=res.data.support;  //时间类型
                    xAxis=res.data.dateStrList; //时间周期
                    var resData=$.extend(chartOpt(colors,legend,xAxis),option,{});
                    resData.series[0].data=res.data.createFirstList ;  //  会话创建者先说话数量列表
                    resData.series[1].data=res.data.notCreateFirstList ;    //非会话创建者先说话数量列表
                    resData.series[2].data=res.data.noFirstList ;    //无人说话数量列表
                    EC.setOption(resData);
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView();

    }]);





/**
 *
 *数据平台 > 首页 > E端数据清单
 */

sysController.controller("dataListsEController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer) {

        /*初始化常用枚举*/
        searchTypesSer($scope,$window.API.DTATCOUNT.SEARCH_TYPES);


        /*查询结果*/
        $scope.submitSearch=function(dt){
            var serKey=angular.copy(dt)||{};
            $scope.getChartsView(serKey)

        };


        /*获取数据*/
        $scope.getChartsView=function(kw){
            var kw=kw||{};
            var query=["?cityId=",kw.cityId].join("");
            $http.get([$window.API.DTATCOUNT.DTATCOUNT_E_SIM_LIST,query].join("")).success(function(res){

                /*数据转换*/
                function formatData(dt){
                    var arr=dt||[],arrs=[];
                    for(var j in arr){
                        var o=arr[j]||{};
                        o.key=j;
                        arrs.push(o)
                    }
                    return arrs
                }

                if(res.stateCode===0){
                    $scope.all = formatData(res.data.all);

                    console.log($scope.all)
                    $scope.logined = formatData(res.data.logined);
                    $scope.notLogined = formatData(res.data.notLogined);
                    $scope.latestNotLogined = formatData(res.data.latestNotLogined);
                }else{
                    errorMsg.make({msg:res.message});
                }
            })
        };

        $scope.getChartsView()

    }]);




/**
 *
 *数据平台 > E端数据清单 > 用户列表
 */

sysController.controller("dataListsUserInfoController", ["$scope", "$http", "$window","chartOpt","$dateTool","$filter","searchTypesSer","$grid",
    function ($scope, $http, $window,chartOpt,$dateTool,$filter,searchTypesSer,$grid) {

        /*初始数据*/
        var cityId=get_param($window.location.href, "cityId");
        var loginedHistoryType=get_param($window.location.href, "loginedHistoryType");
        var hasCase=get_param($window.location.href, "hasCase");
        var employeeType=get_param($window.location.href, "employeeType");


        $grid.initial($scope, [$window.API.DTATCOUNT.DTATCOUNT_E_USER_LIST].join(""),{cityId:cityId,loginedHistoryType:loginedHistoryType,hasCase:hasCase,employeeType:employeeType,orderBy:null});


    }])





