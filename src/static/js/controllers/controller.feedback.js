sysController.controller("FeedBackController",["$scope", "$http", "$window", "$cookieStore", "$timeout", "$grid", 
    function($scope, $http, $window, $cookieStore, $timeout, $grid) {

        $grid.initial($scope, $window.API.FEEDBACK.FEEDBACK_LIST,{orderBy:"createTime"});

        //创建时间
        $scope.dateMethod = function(value) {
          var regTime = new Date(value);
          var value = regTime.getFullYear()+"."+toDouble(regTime.getMonth()+1)+"."+toDouble(regTime.getDate()) + " " + toDouble(regTime.getHours()) +":"+toDouble(regTime.getMinutes())+":"+toDouble(regTime.getSeconds());
          return value;
        }

        $scope.showDialog = function(content, images) {
            $scope.dialog={content: content, images: images};
        }

        $scope.showIMG = function(url) {
            $scope.preview = url;
        }

        /**
         * [toDouble 个位数字补0]
         * @param  {[type]} iNum [description]
         * @return {[type]}      [description]
         */
        function toDouble(iNum) {
            if (iNum < 10) {
                return '0' + iNum;
            } else {
                return '' + iNum;
            }
        }
    }]);