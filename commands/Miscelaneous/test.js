exports.run = (client, msg) => {
  msg.reply("Your permission level is: " + msg.member.permLevel)
};

exports.conf = {
  enabled: true,
  selfbot: false,
  guildOnly: false,
  aliases: [],
  permLevel: 10,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "test",
  description: "tests some shit.",
  usage: "",
  usageDelim: "",
};
