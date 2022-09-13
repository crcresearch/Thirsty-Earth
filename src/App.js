import React from 'react';
import { Client } from 'boardgame.io/react';
import { PushTheButtonFrank } from './Game';
import { ButtonBoard } from './Board';
import { SocketIO } from 'boardgame.io/multiplayer';
import { BASE_URL} from "./config";

const PushTheButtonClient = Client({
  game: PushTheButtonFrank,
  board: ButtonBoard,
  multiplayer: SocketIO({ server: BASE_URL }),
});

const App = () => (

  <div>
    <PushTheButtonClient playerID="0" />
    <PushTheButtonClient playerID="1" />
  </div>
)
export default App;
