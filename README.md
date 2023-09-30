# Singularity

## The simplest, cleanest Discord API wrapper written in node.

Tired of Discord.JS? Singularity is for you! It's super lightweight, with batteries included.

Examples:

Ping in 8 lines!

```js
const Client = require("Singularity");
const client = new Client({ token: process.env.token, intents: 33281 });

client.on("messageCreate", async (msg) => {
    if (msg.content === "ping") {
      client.sendMessage(msg.channel_id, "pong!");
    }
});

client.login(process.env.token);
```

Embeds? No problem, no nonsense!

```js
const client = new Client({ token: process.env.token, intents: 33281 });

client.on("messageCreate", async (msg) => {
    if (msg.content === "ping") {
        const embedData = {
            title: "ABC",
            description: "Sample Description",
            color: 16711680,
            footer: {
                text: "Sample Footer"
            }
        };

        client.sendMessage(msg.channel_id, [embedData]);
    }
});


client.login(process.env.token);
```

Check out the wiki for an in depth explanation of these features.