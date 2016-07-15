var usernames = [
    "freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb",
    "thomasballinger","noobs2ninjas","beohoff","MedryBW"];

$(document).ready(function(){
            var showAll=true;
            var showOnline=false;
            var showOffline=false;

            loadAllUsers();

            $.expr[":"].icontains = $.expr.createPseudo(function(arg) {
                return function( elem ) {
                    return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                };
            });
  
            $("#searchInput").on('input',function(e){
                if($(this).data("lastval")!= $(this).val()){
                    $(this).data("lastval",$(this).val());
                    //change action
                    searchChannels($(this).val());
                };
            });


            $("#viewAll").on("click",function(){
                loadAllUsers();
            });

            $("#viewOnline").on("click",function(){
                $("#searchInput").val('');
                loadOnlineUsers(true);
            });

            $("#viewOffline").on("click",function(){
                $("#searchInput").val('');
                loadOfflineUsers(true);
            });

            function loadAllUsers(){
                $('#streams').html('');
                showAll = true;
                showOnline=false;
                showOffline=false;
                loadOnlineUsers(false);
                loadOfflineUsers(false);
            }

            function loadOnlineUsers(clearHtml){
                if(clearHtml){
                    $('#streams').html('');
                }
                showAll = false;
                showOnline=true;
                showOffline=false;
                var users = usernames.join(',');
                var url ="https://api.twitch.tv/kraken/streams?channel=" + users;
                $.getJSON(url,function(data){
                    var streams = data.streams;
                    for(i=0;i<streams.length;i++){
                        var stream = streams[i];
                        var logo = stream.channel.logo==null?'http://refinerysource.com/wp-content/uploads/2013/01/avatar.png':stream.channel.logo;
                        var displayName = stream.channel.display_name;
                        var twitchUrl = stream.channel.url;
                        var status = stream.channel.status;
                        var onlineSign = "glyphicon glyphicon-ok";
                        setChannelDetails(twitchUrl,logo,displayName,onlineSign,status);
                    }
                });
            }

            function loadOfflineUsers(clearHtml){
                if(clearHtml){
                    $('#streams').html('');
                }
                showAll = false;
                showOnline=false;
                showOffline=true;
                //First get online users and filter them out
                var users = usernames.join(',');
                var url ="https://api.twitch.tv/kraken/streams?channel=" + users;
                $.getJSON(url,function(data){
                    var streams = data.streams;

                    var offlineUsernames = usernames.filter(function(val){
                        for(i=0;i<streams.length;i++){
                            if(streams[i].channel.name.toLowerCase() === val.toLowerCase()){
                                return false;
                            }
                        }
                        return true;
                    });

                    //Then get offline users
                    for(i=0;i<offlineUsernames.length;i++){
                        var username = offlineUsernames[i];
                        var channelUrl = 'https://api.twitch.tv/kraken/channels/' + username + '';
                        $.getJSON(channelUrl,function(channel){
                            var logo = channel.logo==null?'http://refinerysource.com/wp-content/uploads/2013/01/avatar.png':channel.logo;
                            var displayName = channel.display_name;
                            var twitchUrl = channel.url;
                            var onlineSign = "glyphicon glyphicon-exclamation-sign";
                            setChannelDetails(twitchUrl,logo,displayName,onlineSign,'');
                        });
                    }
                });
            }

            function setChannelDetails(twitchUrl,logo,displayName,onlineSign,status){
                var html = '<a href="' + twitchUrl + '" target="_blank">' +
                        '<div class="col-xs-12 list-item">' +
                        '<div class="col-xs-4">' +
                        '<img src="' + logo + '" class="img img-responsive image">' +
                        '</div>' +
                        '<div class="col-xs-6 middle-align">' +
                        '<p class="middle-align">' + displayName + '</p>' +
                        '<footer>' + status + '</footer>' +
                        '</div>' +
                        '<div class="col-xs-2">' +
                        '<i class="' + onlineSign + '"></i>' +
                        '</div>' +
                        '</div>'+
                        '</a>';
                $('#streams').append(html);
            }

            function searchChannels(searchString){
                /*$('a').filter(function(){
                    var searchStr = $(this).text().toLowerCase();
                    return searchStr.indexOf(searchString) == -1;
                });*/
                if(searchString.length>0){

                    $("a").hide();
                    $("a:icontains(" + searchString + ")").show();
                }else{
                    if(showAll){
                        loadAllUsers();
                    }else if(showOnline){
                        loadOnlineUsers(true);
                    }else if(showOffline){
                        loadOfflineUsers(true);
                    }
                }


            }
        });