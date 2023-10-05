const { Client, Events } = require("../index");

const client = new Client({ token: "TOKEN", intents: 33409 });

client.on("READY", (e) => {
  console.log("The bot is ready!");
});

client.on(Events.messageCreate, async (msg) => {
  if(msg.content === ".join") {
    await client.voice.joinVoiceChannel(msg.guild_id, "1153384036560031747");
    await client.voice.playAudioFile("./Music.mp3");
  }
});

client.login();