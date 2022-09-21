const { Server, Origins } =  require('boardgame.io/server');
const { PushTheButtonFrank } = require('./Game');
import cors from "@koa/cors";

const lobbyConfig = {
    apiPort: 8080,
    apiCallback: () => console.log('Running Lobby API on port 8080...'),
  };

const server = Server({
    games: [PushTheButtonFrank],
    origins: [Origins.LOCALHOST],
});

server.run({port: 8000, lobbyConfig});
server.app.use(cors({ origin: "*" }));