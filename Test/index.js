const { Client, Events, Intents } = require("../index");
//const dotenv = require("dotenv");
//dotenv.config()

const client = new Client({
  token: process.env.token,
  intents: [Intents.GUILD_VOICE_STATES, Intents.GUILDS, Intents.GUILD_MESSAGES],
});

client.on("READY", (e) => {
  console.log("The bot is ready!");
});

client.on(Events.messageCreate, async (msg) => {
  if (msg.content === ".join") {
    const guild = await client.guilds.getGuild(msg.guild_id);
    const voice = await client.voice.join(guild, "1151167186350653533");

    const player = await client.voice.player();
    const music = await client.voice.resource("./Music.mp3");

    player.play(music);
    voice.subscribe(player);
  }
});

client.login();
