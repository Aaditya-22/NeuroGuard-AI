import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MemoryGame from "./pages/MemoryGame";
import SequenceGame from "./pages/SequenceGame";
import StroopGame from "./pages/StroopGame";
import PatternGame from "./pages/PatternGame";
import ReactionGame from "./pages/ReactionGame";
import Result from "./pages/Result";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/memory" element={<Layout><MemoryGame /></Layout>} />
        <Route path="/sequence" element={<Layout><SequenceGame /></Layout>} />
        <Route path="/stroop" element={<Layout><StroopGame /></Layout>} />
        <Route path="/pattern" element={<Layout><PatternGame /></Layout>} />
        <Route path="/reaction" element={<Layout><ReactionGame /></Layout>} />
        <Route path="/result" element={<Layout><Result /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;