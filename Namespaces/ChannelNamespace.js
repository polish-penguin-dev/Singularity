const axios = require("axios");
const Channel = require("../Structures/Channel");

class ChannelNamespace {
  constructor(client) {
    this.client = client;
  }

  async getChannel(channelId) {
    const channelData = await axios.get(
      `${this.client.apiBase}/channels/${channelId}`,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );

    const channelStruct = new Channel(this.client, channelData.data);

    return channelStruct;
  }
}

module.exports = ChannelNamespace;
