const moment = require("moment");

exports.run = async (client, guild, user) => {
  const { schemaManager } = client.settingGateway;
  if (!schemaManager.schema["rawLogs"]) {
    schemaManager.add("rawLogs", {type: "String", array: true, default: []}, true);
    schemaManager.add("rawLogChannel", {type: "String"});
  }

  const conf = guild.settings;
  if(!conf.rawLogs.includes("all") && !conf.rawLogs.includes("guildBanAdd") || !conf.rawLogChannel) return;
  const channel = guild.channels.get(conf.rawLogChannel);
  if(!channel) return;
  
  const member = await guild.fetchMember(user.id).catch(o_O=>{});
  
  const action = client.modActions.get("bans").get(user.id);
  const author = action && action.author ? action.author : "unknown";
  const reason = action && action.reason ? action.reason  : "Responsible moderator, you know what to do!";
  const fromNow = member ? moment(member.joinedTimestamp).fromNow() : "unknown (member not cached)";
  channel.send(`🚨 ${user.tag} (${user.id})  was banned by ${author}, they joined: ${fromNow}\n**Reason**: ${reason}`);
};
