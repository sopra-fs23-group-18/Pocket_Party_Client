
export class PeerConnection {
    /**
     * 
     * @param PeerConnectionConfig config 
     */
    constructor(config) {
        this._signalingConnection = config.webSocketConnection;
        this._signalingConnection.setOnMessage((msg) => {
            var content = JSON.parse(msg.data);
            var data = content.data;
            switch (content.type) {
                // Offer case is redundant because only web app sends offers
                case "ANSWER":
                    this._handleAnswer(data);
                    break;
                // when a remote peer sends an ice candidate to us
                case "ICE":
                    this._handleCandidate(data);
                    break;
                default:
                    break;
            }
        });
        this._onReceive = config.onReceive;
    }

    _sendSignal(msg) {
        this._signalingConnection.send(JSON.stringify(msg));
    }

    send = (msg) => {
        if (!this._active) {
            console.warn("Could not send message to peer because Peer Connection is not active");
            return;
        }
    }

    _reconnect = () => {
        setTimeout(() => {
            this.connect()
        }, 2000)
    }

    close = () => {
        this._active = false;
        this._peerConnection.close();
    }

    connect = () => {
        this._active = true;
        this._sendSignal({
            senderId: "webApp",
            type: "JOIN",
        })

        const configuration = {"iceServers" : [ {
            "urls" : "stun:stun2.l.google.com:19302"
        }]};
        this._peerConnection = new RTCPeerConnection(configuration);

        this._dataChannel = this._peerConnection.createDataChannel("dataChannel", { reliable: true });
        this._dataChannel.onmessage = (event) => {
            this._onReceive(event.data);
        };

        this._dataChannel.onerror = (error) => {
            console.warn(`An error occured on the data channel ${error}`)
            // reconnect
            setTimeout(() => {
                this.connect();
            }, 2000)
        };

        this._dataChannel.onclose = () => {
            if (this._active) {
                this._reconnect()
            }
            console.log("Data channel closed");
        };

        this._peerConnection.onicecandidate = (event) => {
            if (event.candidate !== null) {
                this._sendSignal({
                    senderId: "webApp",
                    recipentId: "user0",
                    type: "ICE",
                    data: event.candidate,
                });
            }
        }

        this._peerConnection.onconnectionstatechange = (ev) => {
            switch (this._peerConnection.connectionState) {
                case "connected":
                    console.log("peer connection established successfully!!");
                    break;
                default:
                    break;
            }
        }

        this._peerConnection
            .createOffer()
            .then((offer) => this._peerConnection.setLocalDescription(offer))
            .then(() => {
                this._sendSignal({
                    senderId: "webApp",
                    recipentId: "user0",
                    type: "OFFER",
                    data: this._peerConnection.localDescription,
                });
            })
            .catch((reason) => {
                // An error occurred, so handle the failure to connect
                console.log(reason);
            });

            this._peerConnection.ondatachannel = (event) => {
            this._dataChannel = event.channel;
        };

        
    }

    _handleAnswer = (answer) => {
        this._peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    _handleCandidate = (candidate) => {
        this._peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
};

export class PeerConnectionConfig {
    constructor(webSocketConnection, onReceive) {
        this.webSocketConnection = webSocketConnection;
        this.onReceive = onReceive;
    }
}

export class WebSocketConnection {
    constructor(url) {
        this._url = url;
        this.connection = new WebSocket(this._url);
        this.connection.onerror = () => {
            // Try to reconnect every 5 seconds
            setTimeout(() => {
                this.connection = new WebSocket(this._url);
                this.connection.onmessage = this.onMessage;
                this.connection.onclose = this.onClose;
            }, 5000)
        }
    }

    setOnMessage = (onMessage) => {
        this.onMessage = onMessage;
        this.connection.onmessage = onMessage;
    }

    setOnClose = (onClose) => {
        this.onClose = onClose;
        this.connection.onclose = onClose;
    }
    
    send = (msg) => {
        if (this.connection.readyState !== 1) {
            console.warn("Could not send signaling message to server because Web Socket connection is not open");
            return;
        }
        this.connection.send(msg);
    }
}