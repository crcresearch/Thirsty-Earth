import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameHub } from './GameHub';
import { EnterName } from "./Lobby";
import { GameIDError } from './GameIDError';



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/game/:gameID" element={<GameHub/>} />
      <Route path="/" element={<EnterName/>} />
      <Route path="/game" element={<GameIDError/>}/>
      <Route path="/error" element={<GameIDError/>}/>
    </Routes>
  </BrowserRouter>

)
export default App;
