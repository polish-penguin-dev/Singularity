const axios = require('axios');

class AnyInteraction {
    constructor(client, data) {
        this.id = data.id;
        this.type = data.type;

        this.data = data.data;

        this.guild_id = data.guild_id;

        this.channel = data.channel;
        this.channel_id = data.channel_id;

        this.member = data.member;
        this.user = data.user;
        
        this.token = data.token;

        this.version = data.version;

        this.message = data.message;

        this.app_permissions = data.app_permissions;

        this.locale = data.locale;
        this.guild_locale = data.locale;

        this.entitlements = data.entitlements;

        this.client = client;
    }

    async reply(data) {
        if (typeof data === 'string') {
            data = {
                content: data
            }
        }

        await axios.post(
            `${this.client.apiBase}/interactions/${this.id}/${this.token}/callback`,
            {
                type: 4,
                data
            },

            {
                headers: {
                    'Authorization': `Bot ${this.client.token}`
                }
            }
        )
    }

    async followUp(data) {
        await axios.post(
            `${this.client.apiBase}/webhooks/${this.client.user.id}/${this.token}`,
            data,

            {
                headers: {
                    'Authorization': `Bot ${this.client.token}`
                }
            }
        )
    }

    async getOriginalReply() {
        const data = await axios.get(
            `${this.client.apiBase}/webhooks/${this.client.user.id}/${this.token}/messages/@original`,
            {
                headers: {
                    'Authorization': `Bot ${this.client.token}`
                }
            }
        );

        return data.data;
    }

    async editOriginalReply(data) {
        await axios.patch(
            `${this.client.apiBase}/webhooks/${this.client.user.id}/${this.token}/messages/@original`,
            data,

            {
                headers: {
                    'Authorization': `Bot ${this.client.token}`
                }
            }
        );
    }
}

module.exports = AnyInteraction;