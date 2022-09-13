import path from 'path';
import serve from 'koa-static';
import {DEFAULT_PORT} from "./config";

const { Server, Origins } =  require('boardgame.io/server');
const { PushTheButtonFrank } = require('./Game');


const server = Server({
    games: [PushTheButtonFrank],
    origins: [Origins.LOCALHOST],
});

const PORT = process.env.PORT || DEFAULT_PORT;

//server.run(5000);

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, '../build');
server.app.use(serve(frontEndAppBuildPath))

server.run({
  port: PORT,
  callback: () => {
    server.app.use(
      async (ctx, next) => await serve(frontEndAppBuildPath)(Object.assign(ctx, { path: "index.html" }), next)
    );
  },
});
