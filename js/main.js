client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "Client_ID");
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: "Token",
    password: "Secret",
    onSuccess: onConnect,
    onFailure: doFail,
}

client.connect(options);

function onConnect() {
    client.subscribe("@msg/temp");
}

function doFail(e) {
    console.log(e);
}

function onMessageArrived(message) {
    document.getElementById("show").innerHTML = message.payloadString;
}

//for sending message to netpie
//client.publish("@msg/obj", true or false);