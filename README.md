# Singularity

<a href="https://www.npmjs.com/package/noscord"><img src="https://img.shields.io/npm/v/noscord?style=flat&color=red&logo=npm&logoColor=white" alt="version" /></a>
<a href="https://www.npmjs.com/package/noscord"><img src="https://img.shields.io/npm/dt/noscord?style=flat&logo=docusign&logoColor=white" alt="downloads" /></a>
<a href="https://github.com/polish-penguin-dev/Singularity/wiki"><img src="https://img.shields.io/badge/docs-noscord?color=purple&logo=gitbook&logoColor=white" alt="docs" /></a>
<img src="https://github.com/polish-penguin-dev/Singularity/actions/workflows/publish.yml/badge.svg" alt="publish">

## The simplest, cleanest Discord API wrapper written in node.

Singularity is super lightweight, with batteries included. Give it a try!

Examples:

Ping/Pong!

```js
const Client = require("singularity-discord");
const client = new Client({ token: process.env.token, intents: 33281 });

client.on("MESSAGE_CREATE", async (msg) => {
    if (msg.content === "ping") {
      client.messages.send(msg.channel_id, "pong!");
    }
});

client.login();
```

Check out the [wiki](https://github.com/polish-penguin-dev/Singularity/wiki) to learn more!
