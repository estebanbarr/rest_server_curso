require('dotenv').config();

const Server = require('./models/server');

const server = new Server();

console.log(`Para para, sabías que: [${ process.env.FULANO }]`);

server.listen();
