const { Client } = require("../index");

const token = process.env.token;

const client = new Client({
    token,
    intents: 529
});

client.on("READY", async () => {
    console.log("Bot is ready");

    await client.commands.createGuildCommands("1151167185029431448", [
        {
            name: "ping",
            description: "Test if the bot is responsive"
        },
        {
            name: "ping2",
            description: "Test if the bot is responsive"
        }
    ])

    const commands = await client.commands.getCommands();
})

client.on("INTERACTION_CREATE", async (interaction) => {
    await client.messages.send(interaction, "hi");
})

client.login();
