module.exports = (client) => {
  const request = require('superagent');
  request
  .post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
  .send(`{"server_count": ${client.guilds.size}}`)
  .type('application/json')
  .set('Authorization', client.config.dbotsKey)
  .set('Accept', 'application/json')
  .end(err => {
      if (err) return console.error(err);
  });
}