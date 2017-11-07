exports.run = (client, guild) => {
  if (!guild.available) return;
  client.user.setPresence({game: {name: "g!help | " + client.guilds.size + " Servers", type:0}});
  if(guild.id === "110373943822540800") return;
  guild.fetchMembers().then(() => {
    const members = guild.members;
    let bots = members.filter(m=>m.user.bot).size;
    if(guild.memberCount > 10 && ((bots / guild.memberCount * 100) > 25)) {
      client.emit("log", `Guild ${guild.name} (${guild.id}) joined with ${(bots / guild.memberCount * 100).toFixed(2)}% of bots. Leaving bot collection server.`);
      guild.leave();
    } else
    if(guild.memberCount < 5) {
      guild.leave();
      client.emit("log", `Guild ${guild.name} (${guild.id}) joined with ${guild.memberCount} members. Leaving very small guild.`);
    } else {
      client.emit("log", `Guild ${guild.name} (${guild.id}) joined with ${(bots / guild.memberCount * 100).toFixed(2)}% of bots.`);
    }
  });
};