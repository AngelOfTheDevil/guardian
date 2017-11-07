/*-----------------------
@Everyone Monitor
Assigns a fake @everyone role to anyone that mentions it. 
Use this sparingly - this may be considered "shaming" and will result in
these people being mentioned by anyone who attempts to ping @everyone in the future.

Requirements:
Create a role called "everyone" (Without a @ before it!). Make this role able
to be mentioned by anyone. Give it a cute color like purple.

Moderation note: a fake @everyone role is super useful to prevent accidents. 
The role overrides the default one, and **disables** @everyone pinging completely
so even if you're the Owner, you can't do it. 

-----------------------*/

exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: false,
};

exports.run = async (client, msg) => {
  if(!msg.guild || !msg.member) return; // Second part is about webhooks.
  if(msg.member.permLevel > 0) return;
  const everyoneRole = msg.guild.roles.find(r=>r.name.toLowerCase() === "everyone");
  if(!everyoneRole) return;
  if(msg.mentions.roles.size < 1) return;
  if(msg.mentions.roles && msg.mentions.roles.has(everyoneRole.id)) {
    msg.member.addRole(everyoneRole).catch(O_o => {});
  }
};
