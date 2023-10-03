const { EventEmitter } = require("events");
const WebSocket = require("ws");
const axios = require("axios");

// Import NameSpaces
const MessageNamespace = require("./Namespaces/MessageNamespace");
const FetchNamespace = require("./Namespaces/FetchNamespace");
const UserNamespace = require("./Namespaces/UserNamespace");

// Import Lists
const Colors = require("./Lists/Colors.js");

class Client extends EventEmitter {
    constructor(options) {
        super();
        this.token = options.token;
        this.intents = options.intents;
        this.heartbeatInterval = null;

        // Initialize namespaces
        this.fetch = new FetchNamespace(this);
        this.messages = new MessageNamespace(this);
        this.users = new UserNamespace(this);
    }
  
    handleEvent(data) {
        const event = JSON.parse(data);

        switch(event.op) {
            case 10: // Hello event
                this.startHeartbeat(event.d.heartbeat_interval);
                this.identify();
                break;
            case 11: // Heartbeat ACK
                this.emit("heartbeat", event.d);
                break;
            case 0: // Dispatch event
                this.emit(event.t, event.d);
                break;
            default:
                // Emit raw event data if needed
                this.emit("raw", event);
                break;
        }
    }

    startHeartbeat(interval) {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

        this.heartbeatInterval = setInterval(() => {
            this.ws.send(JSON.stringify({
                op: 1, // Heartbeat opcode
                d: null
            }));
        }, interval);
    }

    identify() {
        this.ws.send(JSON.stringify({
            op: 2, // Identify opcode
            d: {
                token: this.token,
                intents: this.intents,
                properties: {
                    "$os": "linux",
                    "$browser": "my_discord_bot",
                    "$device": "my_discord_bot"
                },
                presence: {
                  status: "online",
                  afk: false
                }
            }
        }));
    }

    async connect() {
        const gatewayUrl = await this.getGatewayUrl();
        this.ws = new WebSocket(gatewayUrl);
        
        this.ws.on("open", () => {
            console.log("Connected to gateway.");
        });
        
        this.ws.on("message", this.handleEvent.bind(this));
    }

    async getGatewayUrl() {
        const response = await axios.get("https://discord.com/api/v10/gateway/bot", {
            headers: { "Authorization": `Bot ${this.token}` }
        });
        return response.data.url;
    }

    login() {
        if (!this.token) {
            throw new Error("Token not provided");
        }
      
        this.connect();
    }

    status(newStatus) {
        if (!["online", "dnd", "idle", "invisible"].includes(newStatus)) {
            throw new Error("Invalid status provided.");
        }

        this.ws.send(JSON.stringify({
            op: 3,
            d: {
              status: newStatus,
              afk: false
            }
        }));
    }
}

module.exports = { Client, Colors };
