const events = require("../Lists/Events");
const CommandInteraction = require("../Structures/CommandInteraction");

module.exports = (client, packet) => {
    // TODO: Handle all interaction types
    // TODO: Make a more readable way of identifying what type an interaction is

    switch (packet.type) {
        case 2: // Slash command
            const interaction = new CommandInteraction(client, packet);
            client.emit(events.interactionCreate, interaction);
            break;
    }
}