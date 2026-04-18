import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MemoryGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;

  const generate = () => {
    let arr = [];
    const count = Math.floor(4 * aiDifficulty); 
    for (let i = 0; i < count; i++) {
      arr.push(Math.floor(Math.random() * 9) + 1);
    }
    return arr;
  };

  const [numbers] = useState(generate());
  const [stage, setStage] = useState("show");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const displayTime = 2000 / aiDifficulty; 
    const timer = setTimeout(() => {
      setStage("input");
      setStartTime(Date.now());
    }, displayTime);
    return () => clearTimeout(timer);
  }, [aiDifficulty]);

  const check = async () => {
    const isCorrect = input === numbers.join("");
    const reactionTime = (Date.now() - startTime) / 1000;
    const score = isCorrect ? 1.0 : 0.0;

    localStorage.setItem('memory', score);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001";
      const response = await axios.post(`${API_URL}/predict`, {
        memory_score: score,
        reaction_time: reactionTime
      });
      localStorage.setItem("aiReport", JSON.stringify(response.data));
      localStorage.setItem('gameDifficulty', response.data.next_difficulty);
    } catch (err) {
      console.log("AI Offline");
    }
    navigate("/sequence");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="mb-4 text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-4 py-1 rounded-full">AI Difficulty: {aiDifficulty.toFixed(1)}x</div>
      <h2 className="text-2xl font-black mb-4">🧠 Neural Memory Test</h2>
      {stage === "show" && (
        <div className="flex gap-3 text-2xl">
          {numbers.map((n, i) => ( <div key={i} className="w-12 h-16 flex items-center justify-center bg-blue-600 text-white font-bold rounded-xl">{n}</div> ))}
        </div>
      )}
      {stage === "input" && (
        <div className="flex flex-col items-center">
          <input autoFocus className="border-2 p-4 text-center text-3xl font-black rounded-2xl w-64" onChange={(e) => setInput(e.target.value)} />
          <button onClick={check} className="mt-6 bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl">Submit to AI</button>
        </div>
      )}
    </div>
  );
}