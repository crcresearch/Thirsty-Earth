import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameHub } from './GameHub';
import { EnterName } from "./Lobby";
import { CreateGame } from "./GameCreation";
import { GameIDError } from './GameIDError';



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/game/:gameID" element={<GameHub/>} />
      <Route path="/" element={<EnterName/>} />
      <Route path="/game-creation" element={<CreateGame/>} />
      <Route path="/error" element={<GameIDError/>}/>
      <Route path="/game" element={<Navigate to="/error"/>}/>
    </Routes>
  </BrowserRouter>

)
export default App;
