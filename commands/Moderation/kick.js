exports.run = async (client, msg, [member, ...reason]) => {
  
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 2,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "mute",
  description: "Mutes or unmutes a user in the server.",
  usage: "<member:member> [reason:str]",
  usageDelim: " ",
  extendedHelp: "",
};