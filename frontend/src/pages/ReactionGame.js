import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReactionGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;
  const [state, setState] = useState("idle");
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  const startGame = () => {
    setState("wait");
    setReactionTime(null);
    const waitDuration = (Math.random() * 3000 + 1000) / aiDifficulty;
    setTimeout(() => {
      setState("go");
      setStartTime(Date.now());
    }, waitDuration);
  };

  const handleClick = async () => {
    if (state === "wait") { alert("Too early!"); return; }
    if (state !== "go") return;

    const time = Date.now() - startTime;
    setReactionTime(time);
    setState("done");

    try {
      const response = await axios.post("http://127.0.0.1:5001/predict", {
        memory_score: Number(localStorage.getItem("memory") || 0),
        sequence_score: Number(localStorage.getItem("sequence") || 0),
        stroop_score: Number(localStorage.getItem("stroop") || 0),
        pattern_score: Number(localStorage.getItem("pattern") || 0),
        reaction_time: time / 1000, // FIXED: Sends seconds (e.g., 2.5) to match CSV
      });

      localStorage.setItem("reaction", time);
      localStorage.setItem("aiReport", JSON.stringify(response.data));
      localStorage.setItem('gameDifficulty', response.data.next_difficulty);
      setTimeout(() => navigate("/result"), 1200);
    } catch (err) {
      navigate("/result");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center">
        <h2 className="text-3xl font-black mb-10 text-slate-800">⚡ Reaction Test</h2>
        <div onClick={handleClick} className={`w-72 h-72 flex flex-col items-center justify-center text-white rounded-[2.5rem] cursor-pointer transition-all duration-300 shadow-2xl ${state === "idle" ? "bg-slate-400" : state === "wait" ? "bg-red-500 animate-pulse" : state === "go" ? "bg-green-500 scale-105" : "bg-blue-600"}`}>
          <span className="text-4xl font-black uppercase">
            {state === "idle" && "Start"}
            {state === "wait" && "Wait..."}
            {state === "go" && "CLICK!"}
            {state === "done" && "Done!"}
          </span>
          {state === "done" && <span className="text-xl font-bold mt-2">{reactionTime}ms</span>}
        </div>
        {(state === "idle" || state === "done") && (
          <button onClick={startGame} className="mt-12 bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 px-12 rounded-2xl transition-all">
            {state === "done" ? "Retry Test" : "Begin Sensor"}
          </button>
        )}
      </div>
    </div>
  );
}