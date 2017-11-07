let spoiler = null;

const reactionFunc = (client, reaction, user) => {
  if(reaction.emoji.name !== "👀" || reaction.message.id !== spoiler || user.id === client.user.id) return;
  reaction.message.edit(`${user} has now revealed this spoiler: \`\`\` At the end, he learns he's a ghost.  \`\`\``);
  reaction.message.clearReactions();
  spoiler = null;
  client.removeListener("messageReactionAdd", reactionFunc);
};

exports.run = async (client, msg) => {
  msg.channel.sendMessage("```Spoilers! (click to reveal)```").then(m=>{
    msg.delete();
    m.react("👀").then( () =>{
      spoiler = m.id;
      client.on("messageReactionAdd", reactionFunc.bind(null, client));
    });
  });
};

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text", "dm"],
  aliases: [],
  permLevel: 10,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "spoiler",
  description: "Test Spoiler Command",
  usage: "",
  usageDelim: "",
  extendedHelp: "",
};
