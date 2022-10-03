import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameHub } from './GameHub';
import { EnterName } from "./Lobby";



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/game/:gameID" element={<GameHub/>} />
      <Route path="/" element={<EnterName/>} />
    </Routes>
  </BrowserRouter>

)
export default App;
