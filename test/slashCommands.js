const { Client } = require('../index');

const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TOKEN;

const client = new Client({
    token,
    intents: 529
});

client.on('READY', async () => {
    console.log('Bot is ready');

    await client.commands.createGuildCommands('1158494797158416564', [
        {
            name: 'ping',
            description: 'Test if the bot is responsive'
        },
        {
            name: 'ping2',
            description: 'Test if the bot is responsive'
        }
    ])

    const commands = await client.commands.getCommands();
})

client.on('INTERACTION_CREATE', async (interaction) => {
    await interaction.reply({ content: 'hi' });
})

client.login();