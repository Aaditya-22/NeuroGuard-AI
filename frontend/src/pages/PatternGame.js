import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PatternGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;

  const generate = () => {
    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 5) + 1;
    const seq = [start, start + diff, start + (diff * 2)];
    return { seq, ans: start + (diff * 3) };
  };

  const [data] = useState(generate());
  const [input, setInput] = useState("");
  const [startTime] = useState(Date.now());

  const check = async () => {
    const isCorrect = Number(input) === data.ans;
    const score = isCorrect ? 1.0 : 0.0;
    localStorage.setItem("pattern", score);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001";
      const response = await axios.post(`${API_URL}/predict`, {
        pattern_score: score,
        reaction_time: (Date.now() - startTime) / 1000
      });
      localStorage.setItem("aiReport", JSON.stringify(response.data));
    } catch (err) { console.log("AI Offline"); }
    navigate("/reaction");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="flex gap-2 mb-8">
        {data.seq.map((n, i) => ( <div key={i} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl font-bold">{n}</div> ))}
        <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-xl">?</div>
      </div>
      <input type="number" className="border-2 p-4 rounded-2xl text-center text-2xl" onChange={(e) => setInput(e.target.value)} />
      <button onClick={check} className="mt-6 bg-slate-900 text-white py-4 px-10 rounded-2xl">Submit</button>
    </div>
  );
}