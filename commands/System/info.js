exports.run = async (client, msg) => {
  const information = `
The Gentle Guardian will help you moderate your server with ease and love.
For more information: <https://guardian.evie.codes/>
Guardian is built on the Komada framework: <https://komada.js.org/>`;
  msg.channel.send(information);
};

exports.conf = {
  enabled: true,
  runIn: ["text", "dm", "group"],
  aliases: ["details", "what"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "info",
  description: "Provides some information about Guardian.",
  usage: "",
  usageDelim: "",
};
