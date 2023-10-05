const axios = require("axios");

class FetchNamespace {
  constructor(client) {
    this.client = client;
  }

  async messages(channelId, limit = 50) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/channels/${channelId}/messages?limit=${limit}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching messages from channel ${channelId}:`,
        error,
      );
      return [];
    }
  }

  async message(channelId, messageId) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/channels/${channelId}/messages/${messageId}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching message ${messageId} from channel ${channelId}:`,
        error,
      );
      return null;
    }
  }

  async channel(channelId) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/channels/${channelId}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for channel ${channelId}:`, error);
      return null;
    }
  }

  async guild(guildId) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/guilds/${guildId}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for guild ${guildId}:`, error);
      return null;
    }
  }

  async user(userId) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/users/${userId}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for user ${userId}:`, error);
      return null;
    }
  }

  async member(guildId, userId) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/guilds/${guildId}/members/${userId}`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for member ${userId}:`, error);
      return null;
    }
  }

  async role(guildId, roleId) {
    try {
      const response = await axios.get(
        `${this.client.apiBase}/guilds/${guildId}/roles`,
        {
          headers: { Authorization: `Bot ${this.client.token}` },
        },
      );
      const roles = response.data;
      return roles.find((role) => role.id === roleId);
    } catch (error) {
      console.error(
        `Error fetching role ${roleId} in guild ${guildId}:`,
        error,
      );
      return null;
    }
  }
}

module.exports = FetchNamespace;
