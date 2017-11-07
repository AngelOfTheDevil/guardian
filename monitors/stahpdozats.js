const slowmode = new Map();
const ratelimit = 7500;

exports.conf = {
  enabled: false,
  ignoreBots: true,
  ignoreSelf: true,
};

exports.init = (client) => {
  const { schemaManager } = client.settingGateway;
  if (!schemaManager.schema["banLevel"]) {
    schemaManager.add("banLevel", {type: "Integer", min: 2, max: 90}, true);
  }
};

exports.run = async (client, msg) => {
  if(!msg.guild || !msg.member) return;
  if(msg.guild.id === "110373943822540800") return;
  const conf = client.settingGateway.get(msg.guild.id);

  // Ignore DMS, Webhooks, Mods, and break if no perms
  if(!msg.guild || !msg.member || !msg.guild.member(client.user).hasPermission("BAN_MEMBERS") || !msg.member.bannable) return;
  
  // Ignore if 1 mention and it's a bot (bot interaction)
  if(msg.mentions.users.size == 1 && msg.mentions.users.first().bot) return;

  // If there is no trace of the author in the slowmode map, add him.
  let entry = slowmode.get(msg.author.id);
  if(!entry) {
    entry = 0;
    slowmode.set(msg.author.id, entry);
  }

  // Count BOTH user and role mentions
  entry += msg.mentions.users.size + msg.mentions.roles.size;

  // If the total number of mentions in the last `ratelimit` is above the server ban level... well, ban their ass.
  if(entry > conf.banLevel) {
    client.emit("log", `[${msg.guild.name}] ${msg.author.username} spamming mentions x${entry}`);
    msg.member.ban(1).then( member=> {
      msg.channel.sendMessage(`:no_entry_sign: User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) has just been banned for mentionning too many users. :hammer:
  Users that have been mentioned, we apologize for the annoyance. Please don't be mad!`);
      client.emit("log", `[${msg.author.id}] Banned ${msg.author.username} from ${msg.guild.name} for mentioning too many users (${entry}).`);
    })
    .catch(e=> client.funcs.log(`[${msg.author.id}] Tried to ban ${msg.author.username} from ${msg.guild.name} but they have a higher role.`));
  } else {
    setTimeout(()=> {
      entry -= msg.mentions.users.size + msg.mentions.roles.size;
      if(entry <= 0) slowmode.delete(msg.author.id);
    }, ratelimit);
  }
};
