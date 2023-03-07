import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameHub } from './GameHub';
import { EnterName } from "./Lobby";
import { CreateGame } from "./GameCreation";
import { GameIDError } from './GameIDError';

// i think gameCreationPassword should go in the .env file but I'm not sure how to call it, process.env.<variable> returns undefined
// tried adding REACT_APP to the beginning and tha also did not work

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/game/:gameID" element={<GameHub/>} />
      <Route path="/" element={<EnterName/>} />
      <Route path="/game-creation" element={<CreateGame gameCreationPassword="testpassword"/>} />
      <Route path="/error" element={<GameIDError/>}/>
      <Route path="/game" element={<Navigate to="/error"/>}/>
    </Routes>
  </BrowserRouter>

)
export default App;
