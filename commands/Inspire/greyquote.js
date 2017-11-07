let db;

exports.run = async (client, msg, [action, ...contents]) => {
  if(!client.providers.has("sqlite")) return msg.reply("this command requires the `sqlite` module which is not present.");
  if(!contents && ["add", "delete"].includes(action)) return msg.reply("you must provide a name for this action.");

  if(!action) {
    return db.getAll(client, "greyquotes")
    .then(rows => {
      msg.channel.sendMessage("**List of Grey's Anatomy quotes by episode**: ```" + rows.map(r=>r.name).join(" | ") + "```");
    });
  }

  if(action === "add") {
    db.insert(client, "greyquotes", ["name", "count", "contents"], [contents[0], 0, contents.slice(1).join(" ")])
    .then(()=> {
      msg.reply(`The quote \`${contents[0]}\` has been added.`);
    });
    return;
  }

  if(action === "delete") {
    db.get(client, "greyquotes", "name", action)
    .then(row => {
      if(!row) return msg.reply("this quote doesn't seem to exist.");
      db.delete(client, "greyquotes", row.id)
      .then(() => {
        return msg.reply("the quote has been deleted. It's gone. For real, it no longer exists. It's pushing up the daisies.");
      })
      .catch(e => {
        return msg.reply("I wasn't able to delete the quote because of the following reason: \n" + e);
      });
    })
    .catch(e => {
      return msg.reply(e);
    });
  }

  if(action === "random") {
    return db.getRandom(client, "greyquotes")
    .then(row => {
      msg.send(row.contents);
      db.update(client, "greyquotes", ["count"], [row.count++], "id", row.id);
    });
  }
  if(!["add", "delete", "random"].includes(action)) {
    db.get(client, "greyquotes", "name", action).then(row => {
      msg.send(row.contents);
      db.update(client, "greyquotes", ["count"], [row.count++], "id", row.id);
    }).catch(e => {
      msg.reply("quote name not found.");
    });
  }
};

exports.conf = {
  enabled: true,
  runIn: ["text", "dm"],
  aliases: ["gq", "quote"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 60,
};

exports.help = {
  name: "greyquote",
  description: "Inspirational quote from Grey's Anatomy",
  usage: "[action:string] [contents:string] [...]",
  usageDelim: " ",
  extendedHelp: "",
};

exports.init = (client) => {
  if (!client.providers.has("sqlite")) {
    console.log("greyquote Command: No Database Found");
  }
  db = client.providers.get("sqlite");
  db.hasTable(client, "greyquotes")
    .then(res => {
      if (!res) {
        let keys = "<name:str> <count:int> <contents:str>";
        db.createTable(client, "greyquotes", keys).catch(console.error);
      }
    });
};
