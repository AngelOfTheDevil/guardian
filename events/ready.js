exports.run = (client) => {
  client.user.setPresence({game: {name: "g!help | " + client.guilds.size + " Servers", type:0}});
};