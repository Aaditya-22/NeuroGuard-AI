import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SequenceGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;

  const generate = () => {
    let arr = [];
    const count = Math.floor(5 * aiDifficulty); // More numbers to remember!
    for (let i = 0; i < count; i++) { arr.push(Math.floor(Math.random() * 9) + 1); }
    return arr;
  };

  const [sequence] = useState(generate());
  const [stage, setStage] = useState("show");
  const [input, setInput] = useState("");
  const [jumbled, setJumbled] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setJumbled([...sequence].sort(() => Math.random() - 0.5));
      setStage("input");
      setStartTime(Date.now());
    }, 2500 / aiDifficulty);
    return () => clearTimeout(timer);
  }, [sequence, aiDifficulty]);

  const check = async () => {
    const isCorrect = input === sequence.join("");
    const score = isCorrect ? 1.0 : 0.0;
    const rTime = (Date.now() - startTime) / 1000;
    
    localStorage.setItem("sequence", score);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "https://neuroguard-backend.onrender.com";
      const response = await axios.post(`${API_URL}/predict`, {
        sequence_score: score,
        reaction_time: rTime,
        current_difficulty: aiDifficulty
      });
      localStorage.setItem("aiReport", JSON.stringify(response.data));
      localStorage.setItem('gameDifficulty', response.data.next_difficulty.toString());
    } catch (err) { console.log("AI Offline"); }
    navigate("/stroop");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="mb-4 text-xs font-bold text-purple-500 bg-purple-50 px-4 py-1 rounded-full uppercase tracking-widest">Level: {aiDifficulty.toFixed(1)}x</div>
      <h2 className="text-2xl font-bold mb-4">🔢 Sequence Test</h2>
      {stage === "show" ? (
        <div className="flex gap-2 text-2xl">
          {sequence.map((n, i) => ( <div key={i} className="p-3 bg-purple-200 rounded-xl">{n}</div> ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex gap-2 text-2xl mb-4">
            {jumbled.map((n, i) => ( <div key={i} className="p-3 bg-yellow-200 rounded-xl">{n}</div> ))}
          </div>
          <input className="border-2 p-2 rounded-xl text-center" placeholder="e.g. 12345" onChange={(e) => setInput(e.target.value)} />
          <button onClick={check} className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-xl">Submit</button>
        </div>
      )}
    </div>
  );
}