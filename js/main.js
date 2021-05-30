const clientID = "50369e17-4123-43b3-ae0b-384898b27d29";
const token = "1642r7oyERQGNjbF62jdw6ZFiu1nPvT9";
const secret = "cgWWcfl2NQygQZvl9NvJdqWzV--02ZY~";
const alias = "NodeMCU"; //Node's(device) name on netpie
var result, text;

//----html elements------
const statusBar = "#status";
const trashPercentage = "#trash-percent";
const toggleBotton = "#toggle-button";


//----State variable----
let openCan = false;
let percentNumber = 0;
let warningShown = false;

$(document).ready(function(e) {
  client = new Paho.MQTT.Client("mqtt.netpie.io", 443, clientID);
  var options = {
    useSSL: true,
    userName: token,
    password: secret,
    onSuccess: onConnect,
    onFailure: doFail,
  };
  client.connect(options);

  function onConnect() {
    $(statusBar).text("Connected").removeClass().addClass("connected");
    client.subscribe("@msg/#");
    GetPreviousData(); //<<--------------------------------- to get old data from the data base
  }

  function doFail(e) {
    $(statusBar).text("Not Connect").removeClass().addClass("error");
    console.log(e);
  }

  //--T0DO: implement this part to fit the project---
  client.onMessageArrived = function(message) {
    text = message.payloadString;
    if(message.destinationName == "@msg/obj") {
      console.log(text + " from obj");
      // data from IR sensor
      if(text === "LEDON") {
        openCan = true;
        $(toggleBotton).attr("checked", openCan);
      }
      else if(text === "LEDOFF") {
        openCan = false;
        $(toggleBotton).attr("checked", openCan);
      }

    } else if(message.destinationName == "@msg/cap") {
      // quantity of trash in the bin
      updateTrashGauge(text);

    } else if(message.destinationName == "@msg/nodeStatus") {
      // the node is online or offline, the status will be sent each time the device changes the status (on to off, off to on)
      text = text.split(" ")[2]; //<<----------------  split ข้อความเดิม("message=NodeMCU is online(offline)") แล้วเอาเฉพาะส่วน online/offline บ่งบอกสถานะของ nodeMCU
      if(text === "online") {
        $(statusBar).text("Connected").removeClass().addClass("connected");
      }
      else if(text === "offline") {
        $(statusBar).text("Connecting...").removeClass().addClass("connect");
      }
      else {
        $(statusBar).text("Not Connect").removeClass().addClass("error");
      }
    }
  };

  $(toggleBotton).click(function(e) {
    if(openCan) {
      mqttSend("@msg/obj", "LEDOFF");
      openCan = false;
    } else {
      openCan = true;
      mqttSend("@msg/obj", "LEDON");
    }

  });
});

function GetPreviousData() {
  var url = "https://api.netpie.io/v2/device/shadow/data" + "?alias=" + alias;
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", url);
  xmlHttp.setRequestHeader("Authorization", "Device " + clientID + ":" + token);
  xmlHttp.send(); //<<------------------- this line and above call the API to get the data from NodeMCU database
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.status == 200 && xmlHttp.readyState == 4) {
      //<<-------------- if the data is ready
      result = JSON.parse(xmlHttp.responseText); //<<----------------  receive the data and parse to JSON form
      console.log(result.data);
      updateTrashGauge(result.data.distance); // distance = ปริมาณขยะ(number) (จาก @msg/cap)
      //you can use result.data.xxx(distance or obj), if obj, value can be true or false which means open or close the bin
    }
  };
}

//ไม่มีฟังก์ชันที่ใช้เช็ค realtime ได้ว่าเว็บเชื่อมต่อกับ netpie หรือป่าว

var mqttSend = function(topic, msg) {
  var message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
};

const updateTrashGauge = function(distance) {
  percentNumber = parseInt(distance);
  $(trashPercentage).text(percentNumber + " %");

  if(percentNumber < 70) {
    $(".warning-text").hide();
    warningShown = false;
  } else {
    if(!warningShown) {
      $(".warning-text").show(1000);
    }
    warningShown = true;
  }
}