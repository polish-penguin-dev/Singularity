# Singularity

## The simplest, cleanest Discord API wrapper written in node.

Singularity is super lightweight, with batteries included. Give it a try!

Examples:

Ping/Pong!

```js
const Client = require("Singularity-Discord");
const client = new Client({ token: process.env.token, intents: 33281 });

client.on("MESSAGE_CREATE", async (msg) => {
    if (msg.content === "ping") {
      client.messages.send(msg.channel_id, "pong!");
    }
});

client.login();
```

Check out the [wiki](https://github.com/polish-penguin-dev/Singularity/wiki) to learn more!