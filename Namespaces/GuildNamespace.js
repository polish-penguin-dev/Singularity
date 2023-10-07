const axios = require('axios');
const Guild = require('../Structures/Guild');

class GuildNamespace {
    constructor(client) {
        this.client = client;
    }

    async getGuild(guildId) {
        const guildData = await axios.get(
            `${this.client.apiBase}/guilds/${guildId}`,
            {
                headers: {
                    'Authorization': `Bot ${this.client.token}`
                }
            }
        )

        const guildStruct = new Guild(this.client, guildData.data);

        return guildStruct;
    }
}

module.exports = GuildNamespace;