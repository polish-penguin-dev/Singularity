const axios = require("axios");
const FetchNamespace = require("./FetchNamespace");

class UserNamespace {
    constructor(client) {
        this.client = client;

        this.fetch = new FetchNamespace(this.client);
    }

    async kick(guildId, userId, reason = "") {
        try {
            await axios.delete(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
                headers: { 
                    "Authorization": `Bot ${this.client.token}`,
                    "Reason": reason
                }
            });
        } catch (error) {
            console.error(`Error kicking user ${userId} from guild ${guildId}:`, error);
        }
    }

    async ban(guildId, userId, reason = "", deleteMessageDays = 0) {
        try {
            await axios.put(`https://discord.com/api/v10/guilds/${guildId}/bans/${userId}`, {
                reason: reason,
                delete_message_days: deleteMessageDays
            }, {
                headers: { 
                    "Authorization": `Bot ${this.client.token}`
                }
            });
        } catch (error) {
            console.error(`Error banning user ${userId} from guild ${guildId}:`, error);
        }
    }

    async timeout(guildId, userId, duration, reason = "") {
        try {
            const timeoutEnds = new Date(Date.now() + duration * 60 * 1000).toISOString();

            await axios.patch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
                communication_disabled_until: timeoutEnds,
                reason: reason
            }, {
                headers: { 
                    "Authorization": `Bot ${this.client.token}`
                }
            });
        } catch (error) {
            console.error(`Error timing out user ${userId} in guild ${guildId}:`, error);
        }
    }

     async untimeout(guildId, userId, reason = "") {
        try {
            await axios.patch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
                communication_disabled_until: null,
                reason: reason
            }, {
                headers: { 
                    "Authorization": `Bot ${this.client.token}`
                }
            });
        } catch (error) {
            console.error(`Error lifting timeout for user ${userId} in guild ${guildId}:`, error);
        }
    }

    async unban(guildId, userId, reason = "") {
        try {
            await axios.delete(`https://discord.com/api/v10/guilds/${guildId}/bans/${userId}`, {
                headers: { 
                    "Authorization": `Bot ${this.client.token}`,
                    "Reason": reason
                }
            });
        } catch (error) {
            console.error(`Error unbanning user ${userId} from guild ${guildId}:`, error);
        }
    }

    //Only checks at guild-level!
    async hasPermission(guildId, userId, permission) {
        try {
            const member = await this.fetch.member(guildId, userId);
          
            for (let roleId of member.roles) {
                const role = await this.fetch.role(guildId, roleId);
                if (role.permissions.includes(permission)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error(`Error checking permission for user ${userId} in guild ${guildId}:`, error);
            return false;
        }
    }
}

module.exports = UserNamespace;