import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Scoring from "./pages/scoring/scoring";
import HeadCount from "./pages/headcount/headcount";
import Ratio from "./pages/ratio/ratio";
import { LoadingProvider } from "./provider/loading-provider";

function App() {
  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
      <LoadingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scoring" element={<Scoring />} />
            <Route path="/headcount" element={<HeadCount />} />
            <Route path="/ratio" element={<Ratio />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </div>
  );
}

export default App;
