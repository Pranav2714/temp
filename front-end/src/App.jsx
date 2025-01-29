import React from "react";
import { Routes, Route } from "react-router-dom";
import Video from "./Components/Video"; // Assuming your Video component is in this path

function App() {
  return (
    <Routes>
      <Route path="/video" element={<Video />} />
      
    </Routes>
  );
}

export default App;
