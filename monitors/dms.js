exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: false,
};

exports.run = async (client, msg) => {
  if(msg.channel.type === "dm") {
    client.emit('log', `[${msg.author.id}] DM received from ${msg.author.username}#${msg.author.discriminator}: ${msg.content}`, "log");
  }
};
