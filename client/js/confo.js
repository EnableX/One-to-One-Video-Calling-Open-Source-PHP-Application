///////////////////////////////////////////////////////
//
// It use Enablex Web Toolkit to communicate with EnableX Servers
//
/////////////////////////////////////////////////////

var localStream = null;
var username = null;
var room;
// Player Options
var options = {
    id: 'vcx_1001',
    attachMode: '',
    player: {
        autoplay: '',
        name: '',
        nameDisplayMode: '',
        frameFitMode: 'bestFit',
        skin: 'classic',
        class: 'player_mode',
        height: '85%',
        width: '85%',
        minHeight: '85%',
        minWidth: '85%',
        aspectRatio: '',
        volume: 0,
        media: '',
        loader: {
            show: false,
            url: 'img/loader.gif',
            style: 'default',
            class: ''
        },
        backgroundImg: 'img/player-bg.gif'
    },
    toolbar: {
        displayMode: 'auto',
        autoDisplayTimeout: 0,
        position: 'top',
        skin: 'default',
        iconset: 'default',
        class: '',
        buttons: {
            play: false,
            share: false,
            mic: false,
            resize: false,
            volume: false,
            mute: false,
            record: false,
            playtime: false,
            zoom: false,
        },
        branding: {
            display: false,
            clickthru: 'https://www.enablex.io',
            target: 'new',
            logo: 'img/enablex.png',
            title: 'EnableX',
            position: 'right'
        }
    }
};

window.onload = function () {

    var countStream = 0;
    var username;
    var setLiveStream = function (stream, userName) {

        // Listening to Text Data
        stream.addEventListener('stream-data', function (e) {
            var text = e.msg.textMessage;
            var html = $("#multi_text_container_div").html();
            $("#multi_text_container_div").html(html + text + "<br>");
        });

        if (!stream.local) {
            var newStreamDiv = document.createElement('div');
            newStreamDiv.setAttribute('id', 'liveStream_' + countStream);
            newStreamDiv.setAttribute('class', 'live_stream_div');
            document.getElementById('multi_video_container_div').appendChild(newStreamDiv);
            stream.show('liveStream_' + countStream, options);
            var node = document.createElement('div');
            if (userName !== "") {
                node.innerHTML = userName;
                node.classList.add("name-div");
                document.getElementById('multi_video_container_div').appendChild(node);
            }
            countStream++;
        } else {
            username = stream.getAttributes().name;
            options.player.loader.class = "";
            options.player.loader.show = false;
            stream.show('local_video_div', options);
            var node = document.createElement('div');
            node.innerHTML = username;
            node.classList.add("name-div");
            document.getElementById('local_video_div').appendChild(node);
        }
    }

    // Get query string from URL
    // const { roomId, usertype, user_ref } = Qs.parse(location.search, {
    const { user_ref, token } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    });

    var config = {
        audio: true,
        video: true,
        data: true,
        attributes: {
            name: user_ref
        },
        options: options
    };

    // var retData = {
    //     name: user_ref,
    //     role: usertype,
    //     roomId: roomId,
    //     user_ref: user_ref,
    // };

    // createToken(retData, function (token) {
        var ATUserList = null;

        // JOin Room
        localStream = EnxRtc.joinRoom(token, config, (success, error) => {

            if (error && error != null) { }

            if (success && success != null) {
                room = success.room;
                setLiveStream(localStream);
                for (var i = 0; i < success.streams.length; i++) {
                    room.subscribe(success.streams[i]);
                }

                // Active Talker list is updated
                room.addEventListener('active-talkers-updated', function (event) {

                    ATUserList = event.message.activeList;
                    var video_player_len = document.querySelector('#multi_video_container_div').childNodes;
                    if (event.message && event.message !== null && event.message.activeList && event.message.activeList !== null) {
                        if (ATUserList.length == video_player_len.length) {
                            return;
                        } else {
                            document.querySelector('#multi_video_container_div').innerHTML = "";
                            for (stream in room.remoteStreams.getAll()) {
                                var st = room.remoteStreams.getAll()[stream];
                                for (j = 0; j < ATUserList.length; j++) {
                                    if (ATUserList[j].streamId == st.getID()) {
                                        setLiveStream(st, ATUserList[j].name);
                                    }
                                }
                            }
                        }
                    }
                    console.log("Active Talker List :- " + JSON.stringify(event));
                });

                room.addEventListener("share-started", function (event) {
                    if (presentationStarted == false && desktop_shared == false) {
                        if (shareStream == null) {
                            var st = room.remoteStreams.get(shareScreenStreamId);
                            if (st.stream !== undefined) {
                                presentationStarted = true;
                                shareStart = true;
                                if (ATUserList.length > 0) {
                                    addATElement("screen_share_div", st, shareScreenStreamId, "100%", '100%');
                                } else {
                                    addATElement("screen_share_div", st, shareScreenStreamId, "100%");
                                }
                            }
                        } else {
                            presentationStarted = true;
                            if (ATUserList.length > 0) {
                                addATElement("screen_share_div", shareStream, shareScreenStreamId, "100%");
                            } else {
                                addATElement("screen_share_div", shareStream, shareScreenStreamId, "100%");
                            }
                        }
                        $("#screenShareContainer").show();
                        $("#videoShareContainer").hide();
                    }
                });

                room.addEventListener("share-stopped", function (event) {
                    desktop_shared = false;
                    shareStart = false;
                    presentationStarted = false;
                    streamShare = null;
                    removeElement(shareScreenStreamId);
                    $("#screenShareContainer").hide();
                    $("#videoShareContainer").show();
                    toggleScreenShareIcon('stop');
                });

                // Stream has been subscribed successfully
                room.addEventListener('stream-subscribed', function (streamEvent) {

                    var stream = (streamEvent.data && streamEvent.data.stream) ? streamEvent.data.stream : streamEvent.stream;
                    for (k = 0; k < ATUserList.length; k++) {
                        if (ATUserList[k].streamId == stream.getID()) {
                            setLiveStream(stream, ATUserList[k].name);
                        }
                    }
                });

                // Stream went out of Room
                room.addEventListener("stream-removed", function (event) {
                    console.log(event);
                });
            }
        });
    // });
}

$(document).on("click", "div.vcx_bar", function (e) {
    $(this).parent().parent().toggleClass("fullScreen");
});

$(document).on("click", ".nav-tabs li a", function (e) {
    $(document).find(".nav-tabs li").removeClass("active");
    $(this).parent().addClass("active");
    $(document).find("div.tab-pane").removeClass("active");
    var activeDivId = $(this).attr("href");
    $(activeDivId).addClass("active");
});

$(document).on("click", "#sendText", function (e) {
    var rawText = $("#textArea").val();
    var text = username + ': ' + rawText;
    $("#textArea").val("");
    localStream.sendData({ textMessage: text });
});

$(document).on("click", "#user_radio", function (e) {
    $(document).find(".user_select_div").show();
});

$(document).on("click", "#all_user_radio", function (e) {
    $(document).find(".user_select_div").hide();
});

function audioMute() {
    var audioActiveElement = document.getElementsByClassName("fa-microphone")[0];
    var audioInActiveElement = document.getElementsByClassName("fa-microphone-slash")[0];
    if (audioInActiveElement) {
        localStream.unmuteAudio(function (arg) {
            // unmute audio. Remove slash from the icon and change title 
            audioInActiveElement.classList.remove("fa-microphone-slash");
            audioInActiveElement.classList.add("fa-microphone");
            audioInActiveElement.title = "Mute Audio";
        });
    } else if (audioActiveElement) {
        localStream.muteAudio(function (arg) {
            // mute audio. Add slash in the icon and change title 
            audioActiveElement.classList.remove("fa-microphone");
            audioActiveElement.classList.add("fa-microphone-slash");
            audioActiveElement.title = "Unmute Audio";
        });
    }
};

function videoMute() {
    var videoActiveElement = document.getElementsByClassName("fa-video")[0];
    var videoInActiveElement = document.getElementsByClassName("fa-video-slash")[0];
    if (videoInActiveElement) {
        localStream.unmuteVideo((res) => {
            var player = document.getElementById("stream" + localStream.getID());
            player.srcObject = localStream.stream;
            player.play();
            // mute audio. Remove slash in the icon and change title 
            videoInActiveElement.classList.remove("fa-video-slash");
            videoInActiveElement.classList.add("fa-video");
            videoInActiveElement.title = "Mute Video";
        });
    } else if (videoActiveElement) {
        localStream.muteVideo((res) => {
            // mute video. Add slash in the icon and change title 
            videoActiveElement.classList.remove("fa-video");
            videoActiveElement.classList.add("fa-video-slash");
            videoActiveElement.title = "Unmute Video";
        });
    }
};

function endCall() {
    var r = confirm("You want to quit?");
    if (r == true) {
        window.location.href = "https://developer.enablex.io";
    }
}

// toggle screen share icon on action - start / stop
function toggleScreenShareIcon(action) {
    var screenShareElement = document.getElementsByClassName("icon-screen-share")[0];
    var slashElement = document.getElementsByClassName("fa-slash")[0];

    if (action == 'stop') {
        // stopping screen share. Remove slash from the font icon and change title 
        if (slashElement) {
            screenShareElement.classList.remove("fa-slash");
            screenShareElement.title = "Start Screen Share";
        }
    } else {
        // starting screen share. Add slash in the font icon and change title
        if (slashElement == undefined) {
            screenShareElement.classList.add("fa-slash");
            screenShareElement.title = "Stop Screen Share";
        }
    }
}


var streamShare = null;
var presentationStarted = false;
var desktop_shared = false;
var shareStart = false;
var shareStream = null;
var shareScreenStreamId = 11;

function screenShare() {

    if (navigator.userAgent.indexOf('QQBrowser') > -1 && room.Connection.getBrowserVersion() < 72) {
        toastr.error(language.ss_unsupport_qq);
        return;
    } else if (navigator.userAgent.indexOf('Chrome') > -1 && room.Connection.getBrowserVersion() < 72) {
        toastr.error(language.ss_unsupport_chrome_below72);
        return;
    }

    if (presentationStarted === false) {
        desktop_shared = true;
        streamShare = room.startScreenShare(function (rs) {
            if (rs.result === 0) {
                presentationStarted = true;
                shareStart = true;
                toggleScreenShareIcon('start');
                    
            } else if (rs.result === 1151) {
                desktop_shared = false;
                toastr.error(rs.error);
            } else if (rs.result === 1144) {
                desktop_shared = false;
                toastr.error(rs.error);
            } else if (rs.result === 1150) {
                desktop_shared = false;
            } else {
                desktop_shared = false;
                toastr.error(language.ss_not_supported);
            }
        });
    } else if (streamShare) {
        room.stopScreenShare(function (res) {
            if (res.result == 0) {
                presentationStarted = false;
                shareStart = false;
                $("#screenShareContainer").hide();
                $("#videoShareContainer").show();
                streamShare = null;
                toggleScreenShareIcon('stop');
            }
        });
    } else {
        desktop_shared = false;
        toastr.error("Presentation is already running")
    }

    if (streamShare) {
        streamShare.addEventListener("stream-ended", function (event) {
            room.stopScreenShare(function (res) {
                if (res.result == 0) {
                    presentationStarted = false;
                    $("#screenShareContainer").hide();
                    $("#videoShareContainer").show();
                    streamShare = null;
                    toggleScreenShareIcon('stop');
                }
            });
        });
    }
}

function addATElement(elem_id, stream, client_id, div_width, div_heigth = "100%") {
    var el = document.createElement("div");
    var elem = document.getElementById(elem_id);
    if (stream) {
        $("#screenShareContainer").show();
        $("#videoShareContainer").hide();
        if (document.getElementById("con_" + client_id) === null) {
            var streamId = stream.getID();
            el.setAttribute("id", "con_" + client_id);
            el.setAttribute("data-stream", streamId);
            if ((presentationStarted && (desktop_shared == false)) && (streamId === 21 || streamId === 11)) {
                elem.prepend(el);
            } else {
                elem.appendChild(el);
            }
            options.player.width = div_width;
            options.player.height = div_heigth;
            stream.play("con_" + client_id, options);
            if (stream.player.stream == undefined) {
                removeElement(client_id);
            }
        }
    }
}

function removeElement(clientID) {
    if (document.querySelector("#con_" + clientID) !== null) {
        document.querySelector("#con_" + clientID).remove();
    }
}