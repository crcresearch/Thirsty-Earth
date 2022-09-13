import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameHub } from './GameHub';
import { EnterName } from "./EnterName";



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/game" element={<GameHub/>} />
      <Route path="/" element={<EnterName/>} />
    </Routes>
  </BrowserRouter>

)
export default App;
