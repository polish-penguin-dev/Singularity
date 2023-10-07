const events = require("../Lists/Events");
const Message = require("../Structures/Message");

module.exports = (client, packet) => {
  const messageStruct = new Message(client, packet);
  client.emit(events.messageCreate, messageStruct);
};
