const embedTypes = {
  ban: 0x8e0000,
  unban: 0x00a0bc,
  kick: 0xbc4b00,
  warn: 0xdbdb00,
  mute: 0xdb0050
};

exports.init = async (client) => {
  const schemaManager = client.settingGateway.schemaManager;
  if (!schemaManager.schema["modLog"]) {
    await schemaManager.add("modLog", {type: "Channel"}, true);
    await schemaManager.add("modLog-embed", {type: "Boolean", default: true}, true);
  }
  client.modActions = new client.methods.Collection();
  client.modActions.set('bans', new client.methods.Collection());
  client.modActions.set('kicks', new client.methods.Collection());
  client.modActions.set('mutes', new client.methods.Collection());
};

exports.createEmbed = (client, author, target, action, reason) => {
  const embed = new client.methods.Embed();
  const color = embedTypes.hasOwnProperty(action) ? embedTypes[action] : 0x222222;
  
  embed
    .setColor(color)
    .setTitle("Case #{x}")
    .setAuthor(`${author.username}#${author.discriminator} (${author.id})`, author.avatarURL)
    .setTimestamp()
    .addField("Action:", client.funcs.toTitleCase(action), true)
    .addField("Target:", `${target.username}#${target.discriminator}`, true)
    .setFooter(target.id, target.avatarURL)
    .setThumbnail(client.user.avatarURL);
  if(!!reason && reason.length > 0) {
    embed.addField("Reason:", reason, true);
  }
  return embed;
};

exports.post = async (client, guild, content) => {
  return new Promise( async (resolve, reject) => {
    const conf = client.settingGateway.get(guild.id);
    let modLog = guild.channels.find(c=>c.name.toLowerCase() === conf.modLog.data);
    let isEmbed = conf["modLog-embed"];
    if (!modLog) {
      return reject(`I cannot find the mod log channel! (${conf.modLog.data})`);
    }
    if (!isEmbed && content.constructor.name === "RichEmbed") {
      return reject(`Settings do not permit embed messages. Please send a instead.`);
    }
    
    // Get Latest Case$
    let lastMessageID = 0, chkContent = "";
    try{ 
      const log = await modLog.fetchMessages({limit: 1});
      const lastMessage = log.first();
      chkContent = (lastMessage.embeds && lastMessage.embeds.length > 0) ? lastMessage.embeds[0].title : lastMessage.content;
      lastMessageID = chkContent.match(/Case \#(\d+)/i)[1];
    } catch (O_o) {console.log(O_o)}

    try{
      let msg;
      if(content.constructor.name === "RichEmbed") {
        content.setTitle(content.title.replace("{x}", ++lastMessageID));
        msg = await modLog.sendEmbed(content).catch(reject);
      } else {
        msg = await modLog.send(content.replace("{x}", lastMessageID++)).catch(reject);
      }
      resolve(msg);
    } catch (e) {
      reject(e);
    }
  });
};