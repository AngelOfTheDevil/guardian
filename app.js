const Komada = require('komada');
const config = require('./config.json');

const client = new Komada.Client(config);

client.login(config.botToken);