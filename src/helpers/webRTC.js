const { getWsUrl } = require("./getDomain")

var session = new WebSocket(getWsUrl());
var peerConnection;
var dataChannel;

session.onopen = (_) => {
    initialize();
}

session.onmessage = (msg) => {
    console.log("Got message", msg.data);
    var content = JSON.parse(msg.data);
    var data = content.data;
    switch (content.type) {
    // Offer case is redundant because only web app sends offers
    case "ANSWER":
        handleAnswer(data);
        break;
    // when a remote peer sends an ice candidate to us
    case "ICE":
        handleCandidate(data);
        break;
    default:
        break;
    }
};
const initialize = () => {
    send({
        senderId: "webApp",
        type: "JOIN",
    })
    const configuration = null;
    peerConnection = new RTCPeerConnection(configuration);

    dataChannel = peerConnection.createDataChannel("dataChannel", { reliable: true });
    dataChannel.onmessage = function (event) {
        console.log("message:", event.data);
    };
    dataChannel.onerror = function (error) {
        console.log("Error:", error);
    };
    dataChannel.onclose = function () {
        console.log("Data channel is closed");
    };
}

const send = msg => session.send(JSON.stringify(msg));

export const establishConnectionWith = (user) => {
    peerConnection.onicecandidate = (event) => {
        if (event.candidate !== null) {
            send({
                senderId: "webApp",
                recipentId: "user0",
                type: "ICE",
                data: event.candidate,
            });
        }
    }

    peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
            send({
                senderId: "webApp",
                recipentId: "user0",
                type: "OFFER",
                data: peerConnection.localDescription,
            });
        })
        .catch((reason) => {
            // An error occurred, so handle the failure to connect
            console.log(reason);
        });
};

const handleAnswer = (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
}

const handleCandidate = (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};