const axios = require("axios");

class ApplicationCommands {
  constructor(client) {
    this.client = client;
  }

  async getGuildCommands(guildId) {
    const res = await axios.get(
      `${this.client.apiBase}/applications/${this.client.user.id}/guilds/${guildId}/commands`,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );

    return res.data;
  }

  async getCommands() {
    const res = await axios.get(
      `${this.client.apiBase}/applications/${this.client.user.id}/commands`,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );

    return res.data;
  }

  async createGuildCommands(guildId, options) {
    await axios.put(
      `${this.client.apiBase}/applications/${this.client.user.id}/guilds/${guildId}/commands`,
      options,

      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );
  }

  async createGlobalCommand(options) {
    await axios.post(
      `${this.client.apiBase}/applications/${this.client.user.id}/commands`,
      options,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );
  }

  async createGuildCommand(options) {
    await axios.post(
      `${this.client.apiBase}/applications/${this.client.user.id}/guilds/${guildId}/commands`,
      options,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );
  }

  async deleteGuildCommand(guildId, commandId) {
    if (!guildId) {
      throw new Error("Requires guild ID");
    }

    if (!commandId) {
      throw new Error("Requires command ID");
    }

    await axios.delete(
      `${this.client.apiBase}/applications/${this.client.user.id}/guilds/${guildId}/commands/${commandId}`,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );
  }

  async deleteCommand(commandId) {
    if (!commandId) {
      throw new Error("Requires command ID");
    }

    await axios.delete(
      `${this.client.apiBase}/applications/${this.client.user.id}/commands/${commandId}`,
      {
        headers: {
          Authorization: `Bot ${this.client.token}`,
        },
      },
    );
  }
}

module.exports = ApplicationCommands;
