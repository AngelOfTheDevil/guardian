exports.run = async (client, msg) => {
  if (!client.user.bot) return msg.reply("Why would you need an invite link for a selfbot...");

  return msg.sendMessage([
    `To add ${client.user.username} to your discord guild:`,
    `<${client.invite}>`
  ]);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredSettings: [],
};

exports.help = {
  name: "invite",
  description: "Displays the join server link of the bot.",
  usage: "",
  usageDelim: "",
};
