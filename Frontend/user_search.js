// Base URLs
const URL = 'https://stopkran.dev:8000';
const base_URL = 'https://stopkran.dev:443';
const socket_URL = 'https://stopkran.dev:9999';

// Turn server URL and credentials
const TURN_SERVER_URL = '130.193.38.173:3478';
const TURN_SERVER_USERNAME = 'avito1';
const TURN_SERVER_CREDENTIAL = 'victory5';

// Variables required for WebRTC and PeerConnection
var pc;
var localStream;
var localStreamElement = document.querySelector('#localStream');
var remoteStreamElement = document.querySelector('#remoteStream');
var enterButton = document.getElementById('acceptBtn');
var leaveButton = document.getElementById('endCallBtn');

// Turn server configuration
const PC_CONFIG = {
  iceServers: [
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    },
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    }
  ]
};


// Variables for user management
var userSid = "None";
var userSocketDict;
var comData;

// Getting username and auth token from cookie
var myUsername = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var tokenValue = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var headerValue = {
    'Authorization':'Token '+tokenValue,
  };

// Redirect user if no token
if( tokenValue == "None" ) { 
    window.location.replace(base_URL+"/login.html");
}

// Socket connection
var socket = io(socket_URL, { autoConnect: false, transports: ['websocket'] });
socket.connect();
socket.emit('useradd', myUsername);
socket.emit('userListReq');

// Accept socket event with list of online users
socket.on('userListRes', (data) => {
  userSocketDict = data;
});


$(document).ready(function(){
  // Logout process
  $('#logout').click(function(){
    // Remove token from cookie    
    let name = "token";
    let value = "None";
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    // Send to user_select page
    window.location.replace(base_URL+"/login.html");
    return false;
  });

  // GET request for user of the service
  $('#refreshBtn').click(function(){
    $.ajax({
      url: URL+'/user_list/',
      type: 'GET',
      headers: headerValue,
      error : function(err) {
        console.log('Error!', err)
        },
      success: function(data) {
        // Show list of users
        let ul = "";
        for (i=0; i < data.length; i++) {
          if (data[i].username == myUsername) {
            // Show client in gray as disabled option
            ul += "<option disabled='disabled' style='color:gray; font-weight:bold;'>" + data[i].username + "</option>";
          }
          else if (data[i].username in userSocketDict) {
            // Show online users connected through websocket in green
            ul += "<option style='color:green; font-weight:bold;'>" + data[i].username + "</option>";
          }
          else {
            // Show offline users
            ul += "<option>" + data[i].username + "</option>";
          }
        }
        document.getElementById("userListForm").innerHTML = ul;
      }
    });
    return false;
  });

  // Show card of user connection
  function infoCardFunc(textElem, btnGroup){
    $("#infoCard").slideToggle("fast");
    $("#infoCard").css("position", "absolute");
    window_width = $(window).width();
    window_height = $(window).height();
    $("#infoCard").css("left", (window_width-$("#infoCard").width())/2);
    $("#infoCard").css("top", (window_height-$("#infoCard").height())/2);
    document.getElementById("infoCardBodyArea").innerHTML = textElem;
    btnGroup.show();
    return false;
  }

  // Close card of user connection
  function infoCardClose(){
    $("#infoCard").slideToggle("fast");
    $('#backBtnGr').hide();
    $('#inviteBtnGr').hide();
    $('#acceptBtnGr').hide();
  }

  // User selection logic
  $('#callForm').submit(function(){

    // Get user name from form
    var opponentName = $('#userListForm').val();
    // Disable invite button to prevent double call
    $('#userInvite').prop('disabled', true);

    // Check if user is online
    if (opponentName in userSocketDict){
      var opponentSid = userSocketDict[opponentName];
      var data = {
        "Name1":myUsername,
        "Name2":opponentName,
        "Sid2":opponentSid
        };
      // Asign communication data to a variable
      comData = data;
      // Emit socket event
      socket.emit('inviteUsr', data);

      // Render calling card
      var textElem = "<p>Calling " + opponentName + "</p>";
      var btnGroup = $('#inviteBtnGr');
      getLocalStream();
      infoCardFunc(textElem, btnGroup);
      return false;
    }
    // Check if user is offline
    else {
      // Render notification card
      var textElem = "<p>User " + opponentName + " is not online!</p>";
      var btnGroup = $('#backBtnGr');
      infoCardFunc(textElem, btnGroup);
      return false;
    }
  });

  // Response to socket event: render call card at the opponent side
  socket.on('inviteUsr', (data) => {
    comData = data;

    // Render notification card
    var textElem = "<p>Incoming call from " + data["Name1"] + "</p>";
    var btnGroup = $('#acceptBtnGr');
    // Open access to camera and microphone
    getLocalStream();
    infoCardFunc(textElem, btnGroup);
    $('#userInvite'). prop('disabled', true);
    return false;
  });

  // Close notification card in case of offline user
  $('#backBtn').click(function(){
    infoCardClose();
    $('#userInvite'). prop('disabled', false);
    return false;
  });

  // Close notification card in case of user decline at the client side
  $('#stopBtn').click(function(){
    socket.emit('declineUsr', comData["Sid2"]);
    infoCardClose();
    $('#userInvite'). prop('disabled', false);
    return false;
  });

  // Close notification card in case of user decline at the opponent side
  $('#declineBtn').click(function(){
    socket.emit('declineUsr', comData["Sid1"])
    infoCardClose();
    $('#userInvite'). prop('disabled', false);
    return false;
  });

  // Lesten to decline user event
  socket.on('declineUsr', () => {
    infoCardClose();
    $('#userInvite'). prop('disabled', false);
    return false;
  });

  // Render call card with video slots
  function callCardFunc(){
    $("#callCard").slideToggle("fast");
    $("#callCard").css("position", "absolute");
    window_width = $(window).width();
    window_height = $(window).height();
    $("#callCard").css("left", (window_width-$("#callCard").width())/2);
    $("#callCard").css("top", (window_height-$("#callCard").height())/2);
  };

  // Accept call: render call card and emit event
  $('#acceptBtn').click(function(){
    callCardFunc();
    comData["Room"] = comData["Sid1"] + "_" + comData["Sid2"];
    socket.emit('acceptUsr', comData);
    return false;
  });

  // Listen to accept user event: render call card and get media access
  socket.on('acceptUsr', (data) => {
    comData = data;
    callCardFunc();
    getLocalStream();
    console.log("Get media");
    return false;
  });

  // Listen sot ready event: start the PeerConnection process
  socket.on('ready', () => {
  console.log('Ready');
  createPeerConnection();
  sendOffer();
  });

  // Function for call card remove
  function callCardClose(){
    $("#callCard").slideToggle("fast");
  };

  // End call logic
  $('#endCallBtn').click(function(){
    pc.close();
    infoCardClose();
    callCardClose();
    $('#userInvite').prop('disabled', false);
    socket.emit('endCall', comData["Room"]);
    comData["Room"] = "None";
    location.reload();
    return false;
  });

  // Listen to endCall event to implement end call logic
  socket.on('endCall', () => {
    pc.close();
    infoCardClose();
    callCardClose();
    $('#userInvite').prop('disabled', false);
    comData["Room"] = "None";
    location.reload();
    return false;
  });
  
  // Listen to data management event: required for connection
  socket.on('data', (data) => {
    console.log('Data received: ',data);
    handleSignalingData(data);
  });


  // HANDLESIGNAL DATA = gets data from signaling server
  let handleSignalingData = (data) => {
    switch (data.type) {
      case 'offer':
        createPeerConnection();
        pc.setRemoteDescription(new RTCSessionDescription(data));
        sendAnswer();
        break;

      case 'answer':
        pc.setRemoteDescription(new RTCSessionDescription(data));
        break;

      case 'candidate':
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;
    }
  };

  // Peer connection setup
  let createPeerConnection = () => {
    try {
      pc = new RTCPeerConnection(PC_CONFIG);
      pc.onicecandidate = onIceCandidate;
      pc.onaddstream = onAddStream;
      pc.addStream(localStream);
      console.log('PeerConnection created');
    }
    catch (error) {
      console.error('PeerConnection failed: ', error);
    }
  };

  // Ice candidate connection setup
  let onIceCandidate = (event) => {
    if (event.candidate) {
      console.log('ICE candidate');
      sendData({
        type: 'candidate',
        candidate: event.candidate
      });
    }
  };

  // Data management function
  let sendData = (data) => {
    data_dict = {
      "main_data":data,
      "room":comData["Room"]
    }
    socket.emit('data', data_dict);
  };

  // Add video and audio stream
  let onAddStream = (event) => {
    console.log('Add stream');
    remoteStreamElement.srcObject = event.stream;
    localStreamElement.srcObject = localStream;
  };

  // Data management function at the opponent side
  let sendAnswer = () => {
    console.log('Send answer');
    pc.createAnswer().then(
      setAndSendLocalDescription,
      (error) => { console.error('Send answer failed: ', error); }
    );
  };

  // Data management function: offer step
  let sendOffer = () => {
    console.log('Send offer');
    pc.createOffer().then(
      setAndSendLocalDescription,
      (error) => { console.error('Send offer failed: ', error); }
    );
  };

  // Peer connection function
  let setAndSendLocalDescription = (sessionDescription) => {
    pc.setLocalDescription(sessionDescription);
    console.log('Local description set');
    sendData(sessionDescription);
  };

  // Get access to video and audio stream
  let getLocalStream = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then((stream) => {
      console.log('Stream found');
      localStream = stream;
    })
    .catch(error => {
      console.error('Stream not found: ', error);
    });
  };
});