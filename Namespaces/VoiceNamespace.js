const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator
} = require("@discordjs/voice");


class VoiceNamespace {
  constructor(client) {
    this.client = client;
  }

  join(guildId, channelId) {
    return joinVoiceChannel({
      guildId: guildId,
      channelId: channelId,
      adapterCreator: DiscordGatewayAdapterCreator
    });
  }

  player() {
    return createAudioPlayer();
  }

  resource(file) {
    return createAudioResource(file);
  } 
}

module.exports = VoiceNamespace;