

/**
 * 创建云信消息类
 * **/

function YX(opt){
    this.scene=opt.scene||"team";
    this.id=opt.id;
    this.$chatContent=$('#chatContentList');
    this.bjContent=!!opt.bjContent;

}
YX.fn=YX.prototype;

/**
 * 云消息记录加载更多,
 */
YX.fn.cloudMsg = function (nims,isCur) {//isCur=true当前消息
    this.$cloudMsgContainer = $('#cloudMsgContainer,#chatContent');
    this.$cloudMsgContainer.off().on('click','.j-loadMore' , this.loadMoreCloudMsg.bind(this,nims,isCur))
}



/**
 * 当前更新的消息
 * **/
YX.fn.contentCurMsgInfo=function(msg, nimCache){
    var msgHtml = appUI.updateChatContentUI(msg, nimCache);
    this.$chatContent.append(msgHtml);
    this.$chatContent.parent().scrollTop(99999)
};

///**
// * 当前聊天的消息//1历史记录20条；2用漫游消息20条,当前采用漫游
// * **/
//
//YX.fn.contentCurMsgHistoryInfo=function(id, nimCache){
//    var temp = appUI.buildChatContentUI(id, nimCache);
//    this.$chatContent.show().html(temp);
//    this.$chatContent.parent().scrollTop(99999);
//};

/**
 * 当前聊天的消息//1历史记录20条
 * **/
YX.fn.contentCurMsgHistoryInfo=function(id, nimCache,nims){
    var that=this;
    var cb=function(error,obj){
        console.log('----',obj)
       if(!error){
           var temp = appUI.buildCloudMsgUI(obj.msgs,nimCache)

           that.$chatContent.html(temp).fadeIn(function(){
               that.$chatContent.parent().scrollTop(99999);
           })

           //setTimeout(function(){  that.$chatContent.parent().scrollTop(99999);},3000)
       }
    }
    this.showCloudMsg(nims,cb)

};


/**
 * 获取未加入临时/已关闭群主消息
 * **/
YX.fn.contentCurMsgHistoryInfo_BG_ClS=function(id, nimCache,nims){
    this.showCloudMsg(nims,this.cbCurMsg)
};

/**
 * 查看云记录,
 */
YX.fn.showCloudMsg = function (nims,cb) { //注意 借助其他群主来获取群历史记录需要设置参数 otherNim={id:groupId,nimTemp:nimTemp}
    var that=this;
    var param ={
            scene:this.scene,
            to:this.id,
            lastMsgId:0,
            limit:20,
            reverse:false,
            done:cb||this.cbCloudMsg.bind(this)
        };
        nims.getHistoryMsgs(param);//注意
    console.log('======================>>>>',param)
};



/**
 * 加载更多云记录
 */
YX.fn.loadMoreCloudMsg = function (nims,isCur) {
    var lastItem = isCur===true ?$("#chatContentList .item").first():$("#cloudMsgList .item").first(),
        param ={
            scene:this.scene,
            to:this.id,
            beginTime:0,
            endTime:parseInt(lastItem.attr('data-time')),
            lastMsgId:parseInt(lastItem.attr('data-idServer')),//idServer 服务器用于区分消息用的ID，主要用于获取历史消息
            limit:20,
            reverse:false,
            done:isCur===true?this.cbCurMsg.bind(this):this.cbCloudMsg.bind(this)
        }
    nims.getHistoryMsgs(param)
}


/**
 * 云记录获取回调
 * @param  {boolean} error
 * @param  {object} obj 云记录对象
 */
YX.fn.cbCloudMsg = function (error,obj) {
    var $node = $("#cloudMsgList"),
        $tip = $("#cloudMsgContainer .u-status span"),
        $infoContent = $(".info-content")

    console.log(obj)
    console.log(error)
    if (!error) {
        if (obj.msgs.length === 0) {
            $tip.html('没有更早的聊天记录')
        } else {
            if(obj.msgs.length<20){
                $tip.html('没有更早的聊天记录')
            }else{
                $tip.html('<a class="j-loadMore">加载更多记录</a>')
            }

            var msgHtml = appUI.buildCloudMsgUI(obj.msgs,nimCache)
            $node.show()
            $(msgHtml).prependTo($node);
        }
    } else {
        console && console.error('获取历史消息失败')
        $tip.html('获取历史消息失败')
    }
}



/**
 * 当前会话历史记录
 * @param  {boolean} error
 * @param  {object} obj 云记录对象
 */
YX.fn.cbCurMsg = function (error,obj) {
    var $node = $(".chat-msg-container"),
        $tip = $(".chat-msg-container .u-status span"),
        $chatContentList=$("#chatContentList");

    console.log('history-result-------------',obj)
    console.log(error)
    if (!error) {
        if (obj.msgs.length === 0) {
            $tip.html('没有更早的聊天记录')
        } else {
            if(obj.msgs.length<20){
                $tip.html('没有更早的聊天记录')
            }else{
                $tip.html('<a class="j-loadMore">加载更多记录</a>')
            }

            var msgHtml = appUI.buildCloudMsgUI(obj.msgs,window.isMine===true?nimCache:nimCacheTemp);
            $chatContentList.show();
            $(msgHtml).prependTo($chatContentList)
         setTimeout(function(){ $("#chatContent").scrollTop(9999)},3000)


        }
    } else {
        console && console.error('获取历史消息失败')
        $tip.html('获取历史消息失败')
    }
}
