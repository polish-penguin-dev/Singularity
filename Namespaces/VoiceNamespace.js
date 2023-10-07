const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

class VoiceNamespace {
  constructor(client) {
    this.client = client;
  }

  join(guild, channelId) {
    console.log(guild.id);
    return joinVoiceChannel({
      guildId: guild.id,
      channelId: channelId,

      adapterCreator: guild.voiceAdapterCreate,
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
