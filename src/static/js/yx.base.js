
window.imCallback={};
var nim=nim||"";
nim&&nim.disconnect();//加载时默认先断开websocket
;(function(win,imCallback){
    var data = {};
    var SDK_IM=function(imCallback){
        var userUID=imCallback.IMToken&&imCallback.IMToken.imUid;//||"350481882"
        var nim = SDK.NIM.getInstance({
            appKey: imCallback.IMToken&&imCallback.IMToken.appKey,//'45c6af3c98409b18a84451215d0bdd6e',
            account: imCallback.IMToken&&imCallback.IMToken.imUid,//||'350481882',
            token: imCallback.IMToken&&imCallback.IMToken.token,//||'f08a548239986f4a9b078e1ee5d63a4e',
            onconnect: onConnect,
            onwillreconnect: onWillReconnect,
            ondisconnect: onDisconnect,
            onerror: onError,



            //========
            // 多端登录
            onloginportschange: onLoginPortsChange,
            // 用户关系
            onblacklist: onBlacklist,
            onsyncmarkinblacklist: onMarkInBlacklist,
            onmutelist: onMutelist,
            onsyncmarkinmutelist: onMarkInMutelist,
            // 好友关系
            onfriends: onFriends,
            onsyncfriendaction: onSyncFriendAction,
            // 用户名片
            onmyinfo: onMyInfo,
            onupdatemyinfo: onUpdateMyInfo,
            onusers: onUsers,
            onupdateuser: onUpdateUser,
            onrobots: onRobots,

            //========

            // 群组
            onteams: onTeams,
            onsynccreateteam: onCreateTeam,
            onteammembers: onTeamMembers,
            onsyncteammembersdone: onSyncTeamMembersDone,
            onupdateteammember: onUpdateTeamMember,


            // 会话
            onsessions: onSessions,
            onupdatesession: onUpdateSession,
            // 消息
            onroamingmsgs: onRoamingMsgs,
            onofflinemsgs: onOfflineMsgs,
            onmsg: onMsg,

            // 系统通知
            onofflinesysmsgs: onOfflineSysMsgs,
            onsysmsg: onSysMsg,
            onupdatesysmsg: onUpdateSysMsg,
            onsysmsgunread: onSysMsgUnread,
            onupdatesysmsgunread: onUpdateSysMsgUnread,
            onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
            oncustomsysmsg: onCustomSysMsg,
            onbroadcastmsg: onBroadcastMsg,
            onbroadcastmsgs: onBroadcastMsgs,
            // 同步完成
            onsyncdone: onSyncDone

        });

        win["nim"]=nim;
        win["nimCache"]=data;
        win["userUID"]=userUID;

    }




    function onConnect() {
        console.log('连接成功');
    }
    function onWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    }
    function onDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    break;
                // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                case 417:
                    break;
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    alert(error.message)
                    window.location.href="/#/main/im-list"
                    break;
                default:
                    break;
            }
        }
    }
    function onError(error) {
        console.log(error);
    }
    /*===========================================用户关系等*/
    function onLoginPortsChange(loginPorts) {
        console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
    }

    function onBlacklist(blacklist) {
        //console.log('收到黑名单', blacklist);
        data.blacklist = nim.mergeRelations(data.blacklist, blacklist);
        data.blacklist = nim.cutRelations(data.blacklist, blacklist.invalid);
        refreshBlacklistUI();
    }
    function onMarkInBlacklist(obj) {
        console.log(obj);
        console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
        if (obj.isAdd) {
            addToBlacklist(obj);
        } else {
            removeFromBlacklist(obj);
        }
    }
    function addToBlacklist(obj) {
        data.blacklist = nim.mergeRelations(data.blacklist, obj.record);
        refreshBlacklistUI();
    }
    function removeFromBlacklist(obj) {
        data.blacklist = nim.cutRelations(data.blacklist, obj.record);
        refreshBlacklistUI();
    }
    function refreshBlacklistUI() {
        // 刷新界面
    }
    function onMutelist(mutelist) {
        //console.log('收到静音列表', mutelist);
        data.mutelist = nim.mergeRelations(data.mutelist, mutelist);
        data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid);
        refreshMutelistUI();
    }
    function onMarkInMutelist(obj) {
        console.log(obj);
        console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
        if (obj.isAdd) {
            addToMutelist(obj);
        } else {
            removeFromMutelist(obj);
        }
    }
    function addToMutelist(obj) {
        data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
        refreshMutelistUI();
    }
    function removeFromMutelist(obj) {
        data.mutelist = nim.cutRelations(data.mutelist, obj.record);
        refreshMutelistUI();
    }
    function refreshMutelistUI() {
        // 刷新界面
    }

    function onFriends(friends) {
        //console.log('收到好友列表', friends);
        data.friends = nim.mergeFriends(data.friends, friends);
        data.friends = nim.cutFriends(data.friends, friends.invalid);
        refreshFriendsUI();
    }
    function onSyncFriendAction(obj) {
        console.log(obj);
        switch (obj.type) {
            case 'addFriend':
                console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
                onAddFriend(obj.friend);
                break;
            case 'applyFriend':
                console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
                break;
            case 'passFriendApply':
                console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
                onAddFriend(obj.friend);
                break;
            case 'rejectFriendApply':
                console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
                break;
            case 'deleteFriend':
                console.log('你在其它端删了一个好友' + obj.account);
                onDeleteFriend(obj.account);
                break;
            case 'updateFriend':
                console.log('你在其它端更新了一个好友', obj.friend);
                onUpdateFriend(obj.friend);
                break;
        }
    }
    function onAddFriend(friend) {
        data.friends = nim.mergeFriends(data.friends, friend);
        refreshFriendsUI();
    }
    function onDeleteFriend(account) {
        data.friends = nim.cutFriendsByAccounts(data.friends, account);
        refreshFriendsUI();
    }
    function onUpdateFriend(friend) {
        data.friends = nim.mergeFriends(data.friends, friend);
        refreshFriendsUI();
    }
    function refreshFriendsUI() {
        // 刷新界面
    }

    function onMyInfo(user) {
        //console.log('收到我的名片', user);
        data.myInfo = user;
        updateMyInfoUI();
    }
    function onUpdateMyInfo(user) {
        //console.log('我的名片更新了', user);
        data.myInfo = NIM.util.merge(data.myInfo, user);
        updateMyInfoUI();
    }
    function updateMyInfoUI() {
        // 刷新界面
    }
    function onUsers(users) {
        //console.log('收到用户名片列表', users);
        data.users = nim.mergeUsers(data.users, users);
    }
    function onUpdateUser(user) {
        //console.log('用户名片更新了', user);
        data.users = nim.mergeUsers(data.users, user);
    }
    function onRobots (robots) {
       // console.log('收到机器人列表', robots);
        data.robots = robots;
    }

    /*===========================================群组*/
    function onTeams(teams) {

        console.log('群列表', teams);
        data.teams = nim.mergeTeams(data.teams, teams);
        onInvalidTeams(teams.invalid);

        (data.teams).forEach(function(x,y){
            imCallback.teamMemberInfos(x["teamId"],nim,data)
        });


    }
    function onInvalidTeams(teams) {
        data.teams = nim.cutTeams(data.teams, teams);
        data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
        refreshTeamsUI();
    }
    function onCreateTeam(team) {
        console.log('你创建了一个群', team);
        data.teams = nim.mergeTeams(data.teams, team);
        refreshTeamsUI();
        onTeamMembers({
            teamId: team.teamId,
            members: owner
        });
    }
    function refreshTeamsUI() {
        // 刷新界面
    }


    function onSyncTeamMembersDone() {
        console.log('同步群列表完成');
    }
    function onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);
        onTeamMembers({
            teamId: teamMember.teamId,
            members: teamMember
        });
    }


    function onTeamMembers(obj) {

        var teamId = obj.teamId;
        var members = obj.members;
        console.log('群id', teamId, '群成员', members);

        data.teamMembers = data.teamMembers || {};
        data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
        data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
    //refreshTeamMembersUI();
    }
    //=========================会话

    function onSessions(sessions) {
        console.log('收到会话列表', sessions);
        data.sessions = nim.mergeSessions(data.sessions, sessions);
        updateSessionsUI();
    }
    function onUpdateSession(session) {
        console.log('会话更新了', session);
        data.sessions = nim.mergeSessions(data.sessions, session);
        updateSessionsUI();
    }
    function updateSessionsUI() {
        // 刷新界面
    }
    //=============================================消息
    function onRoamingMsgs(obj) {
       console.log('漫游消息', obj);
        pushMsg(obj.msgs);
    }
    function onOfflineMsgs(obj) {
       // console.log('离线消息', obj);
        pushMsg(obj.msgs);
    }
    function onMsg(msg) {
        console.log('收到消息', msg.scene, msg.type, msg);
        imCallback.getOtherMsg(msg);
        pushMsg(msg);
    }
    function onBroadcastMsg(msg) {
       // console.log('收到广播消息', msg);
    }
    function onBroadcastMsgs(msgs) {
        //console.log('收到广播消息', msgs);
    }
    function pushMsg(msgs) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].sessionId;
        data.msgs = data.msgs || {};
        data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
    }

    //=============================================系统消息
    function onOfflineSysMsgs(sysMsgs) {
        console.log('收到离线系统通知', sysMsgs);
        pushSysMsgs(sysMsgs);
    }
    function onSysMsg(sysMsg) {
        console.log('收到系统通知', sysMsg)
        pushSysMsgs(sysMsg);
    }
    function onUpdateSysMsg(sysMsg) {
        pushSysMsgs(sysMsg);
    }
    function pushSysMsgs(sysMsgs) {
        data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs);
        refreshSysMsgsUI();
    }
    function onSysMsgUnread(obj) {
        console.log('收到系统通知未读数', obj);
        data.sysMsgUnread = obj;
        refreshSysMsgsUI();
    }
    function onUpdateSysMsgUnread(obj) {
        console.log('系统通知未读数更新了', obj);
        data.sysMsgUnread = obj;
        refreshSysMsgsUI();
    }
    function refreshSysMsgsUI() {
        // 刷新界面
    }
    function onOfflineCustomSysMsgs(sysMsgs) {
        console.log('收到离线自定义系统通知', sysMsgs);
    }
    function onCustomSysMsg(sysMsg) {
        console.log('收到自定义系统通知', sysMsg);
        //imCallback.getOtherMsg(sysMsg);
    }

    function onSyncDone() {
        console.log('同步完成');
        imCallback.finished()
    }

    win["SDK_IM"]=SDK_IM;
})(window,imCallback);






/**
 * 设置临时用户账户
 * **/

function getNimTemp(account,token,onSyncDone){
    console.log(window.IMAppKey,"======",account,'==========',token)

    var nimTemp = SDK.NIM.getInstance({
        appKey: window.IMAppKey,//||'45c6af3c98409b18a84451215d0bdd6e',
        account: account,//||'379679496',
        token: token,//||'9879bcdc3a75ac5c104f3435e9f35407',
        onconnect: onConnect,
        onwillreconnect: onWillReconnect,
        ondisconnect: onDisconnect,
        onerror: onError,
        // 群组
        onteams: onTeams,
        onteammembers: onTeamMembers,
        onsyncteammembersdone: onSyncTeamMembersDone,
        onupdateteammember: onUpdateTeamMember,

        // 用户名片
        onmyinfo: onMyInfo,
        onupdatemyinfo: onUpdateMyInfo,
        // 同步完成
        onsyncdone: onSyncDone

    });
    function onConnect() {
        console.log('nimTemp', "连接成功！")
        window.nimCacheTemp = {};
        window.nimCacheTemp.teamMembers = {};
        window.nimCacheTemp.usersObj = {};
    }

    function onWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    }
    function onDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    break;
                // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                case 417:
                    break;
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    break;
                default:
                    break;
            }
        }
    }
    function onError(error) {
        console.log(error);
    }


    function onMyInfo(user) {
        //console.log('收到我的名片', user);
        window.nimCacheTemp.myInfo = user;
        console.log( window.nimCacheTemp.myInfo)
    }
    function onUpdateMyInfo(user) {
        //console.log('我的名片更新了', user);
        window.nimCacheTemp.myInfo = NIM.util.merge( window.nimCacheTemp.myInfo, user);
    }

    /*===========================================群组*/
    function onTeams(teams) {

        console.log('群列表', teams);
        window.nimCacheTemp.teams = nimTemp.mergeTeams( window.nimCacheTemp.teams, teams);
        onInvalidTeams(teams.invalid);

        (window.nimCacheTemp.teams).forEach(function(x,y){
            imCallback.teamMemberInfos(x["teamId"],nimTemp,window.nimCacheTemp)
        });


    }
    function onInvalidTeams(teams) {
        window.nimCacheTemp.teams = nimTemp.cutTeams( window.nimCacheTemp.teams, teams);
        window.nimCacheTemp.invalidTeams = nimTemp.mergeTeams( window.nimCacheTemp.invalidTeams, teams);
    }


    function onSyncTeamMembersDone() {
        console.log('同步群列表完成');
    }
    function onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);
        onTeamMembers({
            teamId: teamMember.teamId,
            members: teamMember
        });
    }


    function onTeamMembers(obj) {
        var teamId = obj.teamId;
        var members = obj.members;
        console.log('群id', teamId, '群成员', members);

        window.nimCacheTemp.teamMembers =  window.nimCacheTemp.teamMembers || {};
        window.nimCacheTemp.teamMembers[teamId] = nimTemp.mergeTeamMembers( window.nimCacheTemp.teamMembers[teamId], members);
        window.nimCacheTemp.teamMembers[teamId] = nimTemp.cutTeamMembers( window.nimCacheTemp.teamMembers[teamId], members.invalid);
    }



    window.nimTemp=nimTemp;

}
