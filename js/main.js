const trashPercent = document.getElementById("trash-percent");


$(document).ready(function(e) {
    client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "50369e17-4123-43b3-ae0b-384898b27d29");
    var options = {
        useSSL: true,
        userName: "1642r7oyERQGNjbF62jdw6ZFiu1nPvT9",
        password: "cgWWcfl2NQygQZvl9NvJdqWzV--02ZY~",
        onSuccess: onConnect,
        onFailure: doFail
    }
    client.connect(options);

    function onConnect() {
        $("#status").text("Connected").removeClass().addClass("connected");
        client.subscribe("@msg/#");
    }

    function doFail(e) {
        $("#status").text("NOT Connected").removeClass().addClass("error");
        console.log(e);
    }

    //--T0DO: implement this part to fit the project---
    client.onMessageArrived = function(message) {
        /*if(message.payloadString == "true" || message.payloadString == "false") {
            //อัพเดทstatusการเปิด - ปิดของถัง true = มีคน = ถังเปิด
            if(message.payloadString == "true") {
                console.log("can is open")
            } else {
                console.log("can is close")
            }
        } else if(message.payloadString == "NODEON" || message.payloadString == "NODEOFF") {
            //อัพเดทสถานะ node
            if(message.payloadString == "NODEON") {
                console.log("connected");
            } else {
                console.log("not connected");
            }
        } else {
            //อัพเดทปริมาณขยะในถัง
            console.log(message.payloadString);
            trashPercent.innerText = "25 %";

        }*/
        console.log(message.payloadString);
        trashPercent.innerText = "25 %";
    }

    $(".switch").click(function(e) {
        mqttSend("@msg/led", "LEDON");
        document.getElementById("status-led").innerHTML = "LED is ON";
    });

});
var mqttSend = function(topic, msg) {
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
}