import path from 'path';
import serve from 'koa-static';
import {DEFAULT_PORT, API_PORT} from "./config";
import cors from "@koa/cors";

const { Server, Origins } =  require('boardgame.io/server');
const { ThirstyEarth } = require('./Game');

import { PostgresStore } from "bgio-postgres";

// welcome message for when the service starts
console.log("good morning my dear friend. Let's play a game")
// connect to database
const db = new PostgresStore(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`);

const lobbyConfig = {
  apiPort: API_PORT,
  apiCallback: () => console.log('Running Lobby API on port: ' + API_PORT ),
};

const server = Server({
    games: [ThirstyEarth],
    origins: [Origins.LOCALHOST],
    db
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
  lobbyConfig
});
server.app.use(cors({ origin: "*" }));
