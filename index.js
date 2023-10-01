const WebSocket = require("ws");
const axios = require("axios");

class Client {
    constructor(options) {
        this.token = options.token;
        this.intents = options.intents;
        this.eventHandlers = {};
        this.heartbeatInterval = null;
    }

    //Code to handle events, gateway & API

    on(event, handler) {
        this.eventHandlers[event] = handler;
    }
  
    handleEvent(data) {
        const event = JSON.parse(data);

        switch(event.op) {
            case 10: // Hello event
                this.startHeartbeat(event.d.heartbeat_interval);
                this.identify();
                break;
            case 11: // Heartbeat ACK
                // TODO: handle heartbeat acknowledgment here if needed
                break;
            case 0: // Dispatch event
                if (this.eventHandlers[event.t]) {
                  this.eventHandlers[event.t](event.d);
                }
                break;
            default:
                // TODO: Handle other event codes if necessary
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

    //Code for interacting with & using bots
  
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
  
    async send(channelId, content) {
        try {
            let payload;

            if (typeof content === "string") {
                payload = { content: content };
            } else {
                payload = { embeds: content };
            }

            await axios.post(`https://discord.com/api/v10/channels/${channelId}/messages`, payload, {
                headers: { "Authorization": `Bot ${this.token}` }
            });
        } catch (error) {
            console.log("Error sending message:", error);
        }
    }

    async reply(message, content) {
        try {
          let payload;

          if (typeof content === "string") {
              payload = { content: content };
          } else {
              payload = { embed: content };
          }

          payload.message_reference = {
              message_id: message.id
          };

          await axios.post(`https://discord.com/api/v10/channels/${message.channel_id}/messages`, payload, {
              headers: { "Authorization": `Bot ${this.token}` }
          });
        } catch(error) {
          console.log("Error replying to message:", error);
        }
    }

    async delete(message) {
        try {
            await axios.delete(`https://discord.com/api/v10/channels/${message.channel_id}/messages/${message.id}`, {
                headers: { 'Authorization': `Bot ${this.token}` }
            });
        } catch (error) {
            console.error(`Error deleting message ${message.id} from channel ${message.channel_id}:`, error);
        }
    }

    async react(message, emoji) {
        try {
            const encodedEmoji = encodeURIComponent(emoji);
            
            await axios.put(
                `https://discord.com/api/v10/channels/${message.channel_id}/messages/${message.id}/reactions/${encodedEmoji}/@me`,
                {}, 
                {
                    headers: { 'Authorization': `Bot ${this.token}` }
                }
            );
        } catch (error) {
            console.error(`Error reacting to message ${message.id} in channel ${message.channel_id} with ${emoji}:`, error);
        }
    }
}
