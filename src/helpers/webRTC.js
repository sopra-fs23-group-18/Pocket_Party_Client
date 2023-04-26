
export class PeerConnection {
    /**
     * 
     * @param PeerConnectionConfig config 
     */
    constructor(config) {
        this._signalingConnection = config.webSocketConnection;
        this._onReceive = config.onReceive;
        this._onConnected = config.onConnected
        this._lobbyId = config.lobbyId;
        this._playerId = config.playerId;
        this._connected = false;
        this._msg_queue = [];

        this._signalingConnection.setOnMessage((msg) => {
            var content = JSON.parse(msg.data);
            var data = content.data;
            
            if(content.senderId !== `player${this._playerId}`){
                return;
            }
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
        
    }

    _sendSignal(msg) {
        this._signalingConnection.send(JSON.stringify(msg));
    }

    send = (msg) => {
        if (!this._connected) {
            console.warn("Could not send message to peer because Peer Connection is not active");
            return;
        }
        switch (this._dataChannel.readyState) {
            case "open":
                this._dataChannel.send(msg);
                break;
            default:
                break;
        }
        console.warn("Data channel not opened yet adding msg to sending queue")
        this._msg_queue.push(msg);

    }

    reconnect = () => {
        this._peerConnection.restartIce();
        console.log("Schedule reconnect");
        // setTimeout(() => {
        //     this._dataChannel.close();
        //     this._dataChannel = null;
        //     this._peerConnection.close();
        //     this._peerConnection = null;
        //     this.connect()
        // }, 2000)
    }

    close = () => {
        console.log("Closing peer connection");
        this._active = false;
        this._dataChannel.close()
        this._peerConnection.close();
        this._dataChannel = null;
        this._peerConnection = null;
    }

    connect = () => {
        this._active = true;
        this._sendSignal({
            senderId: `webApp${this._lobbyId}`,
            type: "JOIN",
        })

        const configuration = {
            "iceServers": [{
                "urls": "stun:stun.nextcloud.com:443"
            }]
        };
        this._peerConnection = new RTCPeerConnection(configuration);

        this._peerConnection.onconnectionstatechange = (ev) => {
            console.log(this._peerConnection.connectionState);
            switch (this._peerConnection.connectionState) {
                case "connected":
                    console.log("peer connection established successfully!!");
                    this._connected = true
                    this._onConnected(this);
                    console.log("peer connection established successfully!!");
                    break;
                default:
                    break;
            }
        }

        this._dataChannel = this._peerConnection.createDataChannel(`dataChannel`, { ordered: true, reliable: true, negotiated: true, id: 0 });
        this._dataChannel.onmessage = (event) => {
            this._onReceive(event.data);
        };

        this._dataChannel.onerror = (error) => {
            console.warn(`An error occured on the data channel ${error}`)
            // reconnect
            this.reconnect()
            this._connected = false;
        };

        this._dataChannel.onclose = () => {
            this._connected = false;
            if (this._active) {
                // this._reconnect()
            }
            console.log("Data channel closed");
        };

        this._peerConnection.onicecandidate = (event) => {
            if (event.candidate !== null) {
                this._sendSignal({
                    senderId: `webApp${this._lobbyId}`,
                    recipentId: `player${this._playerId}`,
                    type: "ICE",
                    data: event.candidate,
                });
            }
        }

        this._peerConnection
            .createOffer()
            .then((offer) => this._peerConnection.setLocalDescription(offer))
            .then(() => {
                this._sendSignal({
                    senderId: `webApp${this._lobbyId}`,
                    recipentId: `player${this._playerId}`,
                    type: "OFFER",
                    data: this._peerConnection.localDescription,
                });
            })
            .catch((reason) => {
                // An error occurred, so handle the failure to connect
                console.log(reason);
            });

        // this._peerConnection.ondatachannel = (event) => {
        //     this._dataChannel = event.channel;
        // };

        this._dataChannel.onopen = (event) => {
            console.log("Data channel is now open");
            console.log(`Having ${this._msg_queue.length} messages in queue sending all of them now`);
            for (let i = 0; i < this._msg_queue.length; i++) {
                const msg = this._msg_queue.shift();
                this._dataChannel.send(msg);
            }
        }


    }

    _handleAnswer = (answer) => {
        this._peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    _handleCandidate = (candidate) => {
        this._peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
};

export class PeerConnectionConfig {
    constructor(webSocketConnection, onReceive, onConnected, lobbyId, playerId) {
        this.webSocketConnection = webSocketConnection;
        this.onReceive = onReceive;
        this.lobbyId = lobbyId;
        this.playerId = playerId;
        this.onConnected = onConnected;

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
        this._msg_queue = [];
        this._on_msg_callbacks = [];

        this.connection.onopen = () => {
            console.log("WS open now");
            for (let i = 0; i < this._msg_queue.length; i++) {
                const msg = this._msg_queue.shift();
                this.connection.send(msg);
            }
        }

        this.connection.onmessage = (msg) => {
            console.log(`${this._on_msg_callbacks.length} Callbacks for singaling`);
            for(const callback of this._on_msg_callbacks){
                callback(msg)
            }
        }

    }

    setOnMessage = (onMessage) => {
        this._on_msg_callbacks.push(onMessage);
        // this.onMessage = onMessage;
        // this.connection.onmessage = onMessage;
    }

    setOnClose = (onClose) => {
        this.onClose = onClose;
        this.connection.onclose = onClose;
    }

    send = (msg) => {
        if (this.connection.readyState !== 1) {
            this._msg_queue.push(msg);

            console.warn("Could not send signaling message to server because Web Socket connection is not open");
            return;
        }
        this.connection.send(msg);
    }
}