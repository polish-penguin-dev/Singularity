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
    await client.voice.joinVoiceChannel(msg.guild_id, "1153384036560031747");
  }
});

client.login();
