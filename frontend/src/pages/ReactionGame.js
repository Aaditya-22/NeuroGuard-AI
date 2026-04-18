import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReactionGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;
  const [state, setState] = useState("idle");
  const [startTime, setStartTime] = useState(null);

  const startGame = () => {
    setState("wait");
    setTimeout(() => {
      setState("go");
      setStartTime(Date.now());
    }, Math.random() * 3000 + 1000);
  };

  const handleClick = async () => {
    if (state !== "go") return;
    const time = (Date.now() - startTime) / 1000;
    setState("done");
    localStorage.setItem("reaction", time);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001";
      const response = await axios.post(`${API_URL}/predict`, {
        // This is the FINAL game, so we send ALL scores to get the final report!
        memory_score: localStorage.getItem("memory") || 0,
        sequence_score: localStorage.getItem("sequence") || 0,
        stroop_score: localStorage.getItem("stroop") || 0,
        pattern_score: localStorage.getItem("pattern") || 0,
        reaction_time: time
      });
      localStorage.setItem("aiReport", JSON.stringify(response.data));
      setTimeout(() => navigate("/result"), 1000);
    } catch (err) { navigate("/result"); }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div onClick={handleClick} className={`w-72 h-72 flex items-center justify-center text-white rounded-[2.5rem] cursor-pointer ${state === "go" ? "bg-green-500" : "bg-slate-400"}`}>
        <span className="text-4xl font-black">{state === "go" ? "CLICK!" : "WAIT..."}</span>
      </div>
      <button onClick={startGame} className="mt-10 bg-slate-900 text-white py-4 px-10 rounded-2xl">Start Test</button>
    </div>
  );
}