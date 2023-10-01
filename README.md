# Singularity

## The simplest, cleanest Discord API wrapper written in node.

Singularity is super lightweight, with batteries included. Give it a try!

Examples:

Ping/Pong!

```js
const Client = require("Singularity");
const client = new Client({ token: process.env.token, intents: 33281 });

client.on("MESSAGE_CREATE", async (msg) => {
    if (msg.content === "ping") {
      client.send(msg.channel_id, "pong!");
    }
});

client.login();
```

Embeds? We got you covered!

```js
const client = new Client({ token: process.env.token, intents: 33281 });

client.on("MESSAGE_CREATE", async (msg) => {
    if (msg.content === "ping") {
        client.send(msg.channel_id, [
          {
            title: "Pong!",
            description: "I'm Alive!",
            color: 16711680,
            footer: {
                text: ":ping_pong: | Ping Bot"
            }
          }
        ]);
    }
});

client.login();
```

Check out the wiki for an in depth explanation of these features.