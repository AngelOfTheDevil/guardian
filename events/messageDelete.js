exports.run = (client, msg) => {
  const { schemaManager } = client.settingGateway;
  client.user.setPresence({game: {name: "g!help | " + client.guilds.size + " Servers", type:0}});
  if (!schemaManager.schema["rawLogs"]) {
    schemaManager.add("rawLogs", {type: "String", array: true, default: []}, true);
    schemaManager.add("rawLogChannel", {type: "String"});
  }

  if(!msg || !msg.id || !msg.content || !msg.guild) return;
  const conf = msg.guild.settings;
  if(!conf.rawLogs.includes("all") && !conf.rawLogs.includes("messageDelete") || !conf.rawLogChannel) return;
  const channel = msg.guild.channels.get(conf.rawLogChannel);
  if(!channel) return;
  channel.send(`🗑 ${msg.author.tag} (${msg.author.id}) : Message Deleted in ${msg.channel.name}:\n${msg.cleanContent}`);
};