/**
 *
 */
var sysFilter = angular.module("sysFilter",[]);

sysFilter.filter('monitorWords',function(){
    return function(input){
        if(input){
            return input.length;
        }
        else return 0;
    };
})

.filter("wordLimit",function(){
    return function (word){
        return word.slice(0,5);
    };
})

.filter("removeNull",function(){
    return function(params){
        if(params === null){
            return "";
        }
        else
        return params+"-";
    };
})

.filter("gender",function(){
    return function(params){
        switch (params) {
            case 0:
                return "保密";
            case 1:
                return "男";
            case 2:
                return "女";
        }
    };
})

.filter("setString",function(){
    return function(params){
       return String(params)
    };
})




