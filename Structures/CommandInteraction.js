const axios = require("axios");

const AnyInteraction = require("./AnyInteraction");

class CommandInteraction extends AnyInteraction {
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = CommandInteraction;