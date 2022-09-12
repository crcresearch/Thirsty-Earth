const { Server, Origins } =  require('boardgame.io/server');
const { PushTheButtonFrank } = require('./Game');

const server = Server({
    games: [PushTheButtonFrank],
    origins: [Origins.LOCALHOST],
});

server.run(8000);