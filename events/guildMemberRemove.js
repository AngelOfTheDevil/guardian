const moment = require("moment");

exports.run = async (client, member) => {
  const { schemaManager } = client.settingGateway;
  if (!schemaManager.schema["rawLogs"]) {
    schemaManager.add("rawLogs", {type: "String", array: true, default: []}, true);
    schemaManager.add("rawLogChannel", {type: "String"});
  }

  if(!member || !member.id || !member.guild) return;
  
  const guildBans = await member.guild.fetchBans().catch(o_O=>{});
  if(guildBans && guildBans.has(member.user.id)) return;
  
  const auditActions = await member.guild.fetchAuditLogs({user: member.user}).catch(o_O=>{});
  if(!auditActions || auditActions.size === 0) return;
  
  
  
  
  if(client.modActions.get("bans").has(member.user.id)) return;
  if(client.modActions.get("kicks").has(member.user.id)) return;
  
  const conf = member.guild.settings;
  if(!conf.rawLogs.includes("all") && !conf.rawLogs.includes("messageUpdate") || !conf.rawLogChannel) return;
  const channel = member.guild.channels.get(conf.rawLogChannel);
  if(!channel) return;
  const fromNow = moment(member.joinedTimestamp).fromNow();
  channel.send(`📤 ${member.user.tag} (${member.user.id}) left, they had joined: ${fromNow}`);
};
