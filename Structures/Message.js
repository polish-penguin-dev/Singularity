const axios = require("axios");
const Channel = require("./Channel");

class Message {
  constructor(client, data) {
    this.id = data.id;
    this.channel_id = data.channel_id;

    this.author = data.author;
    this.content = data.content;

    this.timestamp = data.timestamp;
    this.edited_timestamp = data.edited_timestamp;

    this.tts = data.tts;

    this.mention_everyone = data.mention_everyone;
    this.mentions = data.mentions;
    this.mention_roles = data.mention_roles;
    this.mention_channels = data?.mention_channels;

    this.attachments = data.attachments;
    this.embeds = data.embeds;

    this.reactions = data?.reactions;

    this.nonce = data?.nonce;

    this.pinned = data.pinned;

    this.webhook_id = data?.webhook_id;

    this.type = data.type;

    this.activity = data?.activity;

    this.application = data?.application;
    this.application_id = data?.application_id;

    this.message_reference = data?.message_reference;

    this.flags = data?.flags;

    this.referenced_message = data?.referenced_message;

    this.interaction = data?.interaction;

    this.thread = data?.thread;

    this.components = data?.components;
    this.sticker_items = data?.sticker_items;
    this.stickers = data?.stickers;

    this.position = data?.position;

    this.role_subscription_data = data?.role_subscription_data;

    this.resolved = data?.resolved;

    this.client = client;
  }

  get channel() {
    return new Channel(this.client, { id: this.channel_id });
  }
}

module.exports = Message;
