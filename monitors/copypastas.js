const triggers = [
  "They will try to add you and send you a link to their fake virus Discord server",
  "Do not Accept a friend request from Chrisopeer Davies and Jessica Davies",
  "There's a new malicious discord bot going around known as DoraTheExploiter",
  "They can destroy your computer with a file called KattyPoo.exe",
  "please get into contact with me via PMs as soon as you possibly can if you have seen or come into contact with a person that goes by or can be associated with any of the following identities"
  ]
  
exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: false,
};


exports.run = async (client, msg) => {
  if(!msg.guild || !msg.member) return; // Second part is about webhooks.
  if(msg.member.permLevel > 0) return;
  if(msg.guild.id === "110373943822540800") return;
  const cleanMsg = msg.content.toLowerCase();
  if(cleanMsg.includes("public service announcement")) { 
    let deleted = false;
    try { 
      await msg.delete();
      deleted = true;
    } catch(e) {
      deleted = false;
    }
    const extra = deleted ? "Your message has been deleted in order to avoid *other* people from taking it seriously. Please stop pasting it, it is not true." : "Please stop pasting this message, it is not true. Everyone else, do not start spreading this yourself.";
    const reply = `Discord does not share "Public Service Announcements" via copy/pasted messages by users.
    These messages never have any basis in reality, and are often memes that have been around for decades in various forms.
    ${extra}`;
    return msg.reply(reply);
  }
  
};
