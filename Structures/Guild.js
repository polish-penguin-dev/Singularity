class Guild {
  constructor(client, data) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.icon_hash = data?.icon_hash;

    this.splash = data.splash;
    this.discovery_splash = data.discovery_splash;

    this.owner = data.owner;
    this.owner_id = data.owner_id;

    this.permissions = data?.permissions;

    this.region = data?.region;

    this.afk_channel_id = data.afk_channel_id;
    this.afk_timeout = data.afk_timeout;

    this.widget_enabled = data?.widget_enabled;
    this.widget_channel_id = data.widget_channel_id;

    this.verification_level = data.verification_level;

    this.default_message_notifications = data.default_message_notifications;

    this.explicit_content_filter = data.explicit_content_filter;

    this.roles = data.roles;
    this.emojis = data.emojis;

    this.features = data.features;

    this.mfa_level = data.mfa_level;

    this.application_id = data.application_id;
    this.system_channel_id = data.system_channel_id;
    this.system_channel_flags = data.system_channel_flags;

    this.rules_channel_id = data.rules_channel_id;

    this.max_presences = data?.max_presences;
    this.max_members = data?.max_members;

    this.vanity_url_code = data.vanity_url_code;

    this.description = data.description;

    this.banner = data.banner;

    this.premium_tier = data.premium_tier;
    this.premium_subscription_count = data?.premium_subscription_count;

    this.preferred_locale = data?.preferred_locale;

    this.public_updates_channel_id = data.public_updates_channel_id;

    this.max_video_channel_users = data?.max_video_channel_users;
    this.max_stage_video_channel_users = data?.max_stage_video_channel_users;

    this.approximate_member_count = data?.approximate_member_count;
    this.approximate_presence_count = data?.approximate_presence_count;

    this.welcome_screen = data?.welcome_screen;

    this.nsfw_level = data.nsfw_level;

    this.stickers = data?.stickers;

    this.premium_pogress_bar_enabled = data.premium_pogress_bar_enabled;

    this.safety_alerts_channel_id = data.safety_alerts_channel_id;

    this.client = client;
  }

  get voiceAdapterCreate() {
    return (methods) => {
      return {
        sendPayload: (payload) => {
          console.log(payload.d);
          this.client.ws.send(JSON.stringify({ op: payload.op, d: payload.d }));

          return true;
        },
      };
    };
  }
}

module.exports = Guild;
