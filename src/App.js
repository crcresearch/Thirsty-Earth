import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameHub } from './GameHub';



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<GameHub/>} />
    </Routes>
  </BrowserRouter>

)
export default App;
