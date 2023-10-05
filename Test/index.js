const { Client, Events } = require("../index");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ token: process.env.TOKEN, intents: 33409 });

client.on("READY", (e) => {
  console.log("The bot is ready!");
});

client.on(Events.messageCreate, async (msg) => {
  if (msg.content === ".join") {
    await client.voice.joinVoiceChannel(msg.guild_id, "1158494798483828819");
    await client.voice.playAudioFile("./Music.mp3");
  }
});

client.login();
