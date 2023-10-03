class MessageNamespace {
    constructor(client) {
        this.client = client; 
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
                headers: { "Authorization": `Bot ${this.client.token}` }
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
              headers: { "Authorization": `Bot ${this.client.token}` }
          });
        } catch(error) {
          console.log("Error replying to message:", error);
        }
    }

    async delete(message) {
        try {
            await axios.delete(`https://discord.com/api/v10/channels/${message.channel_id}/messages/${message.id}`, {
                headers: { "Authorization": `Bot ${this.client.token}` }
            });
        } catch (error) {
            console.error(`Error deleting message ${message.id} from channel ${message.channel_id}:`, error);
        }
    }

    //Cannot delete messages older than 14 days!
    async purge(channelId, messages) {
        try {
            const messageIds = messages.map(msg => msg.id);

            await axios.post(`https://discord.com/api/v10/channels/${channelId}/messages/bulk-delete`, {
                messages: messageIds
            }, {
                headers: { "Authorization": `Bot ${this.client.token}` }
            });
        } catch(error) {
            console.log(`Error purging (BulkDelete) messages in channel ${channelId}:`, error);
        }
    }


    async react(message, emoji) {
        try {
            const encodedEmoji = encodeURIComponent(emoji);
            
            await axios.put(
                `https://discord.com/api/v10/channels/${message.channel_id}/messages/${message.id}/reactions/${encodedEmoji}/@me`,
                {}, 
                {
                    headers: { "Authorization": `Bot ${this.client.token}` }
                }
            );
        } catch (error) {
            console.error(`Error reacting to message ${message.id} in channel ${message.channel_id} with ${emoji}:`, error);
        }
    }
}