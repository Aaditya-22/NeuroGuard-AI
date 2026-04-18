import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const colors = ["red", "green", "blue", "yellow"];

export default function StroopGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const [word, setWord] = useState(randomColor());
  const [color, setColor] = useState(randomColor());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);

  const totalRounds = Math.floor(5 * aiDifficulty);

  const handleClick = async (selected) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = selected === color;
    const newScore = isCorrect ? score + 1 : score;

    if (round >= totalRounds) {
      const finalAcc = newScore / totalRounds;
      localStorage.setItem("stroop", finalAcc);
      try {
        const API_URL = process.env.REACT_APP_API_URL || "https://neuroguard-backend.onrender.com";
        const response = await axios.post(`${API_URL}/predict`, {
          stroop_score: finalAcc,
          reaction_time: (totalTime + timeTaken) / totalRounds
        });
        localStorage.setItem("aiReport", JSON.stringify(response.data));
      } catch (err) { console.log("AI Offline"); }
      navigate("/pattern");
    } else {
      setScore(newScore);
      setTotalTime(prev => prev + timeTaken);
      setRound(round + 1);
      setWord(randomColor());
      setColor(randomColor());
      setStartTime(Date.now());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
       <div className="mb-10 flex items-center gap-3 bg-amber-50 border border-amber-100 px-6 py-2 rounded-full shadow-sm">
        <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">AI Attention Monitor: {aiDifficulty.toFixed(1)}x</span>
      </div>
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center max-w-sm w-full">
        <div className="h-32 flex items-center justify-center mb-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <h1 style={{ color: color }} className="text-6xl font-black">{word.toUpperCase()}</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {colors.map((c) => (
            <button key={c} onClick={() => handleClick(c)} className="py-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-900 font-black text-slate-700 uppercase text-xs tracking-widest transition-all">
              {c}
            </button>
          ))}
        </div>
        <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-lg font-black text-slate-900">
          <span>{round} / {totalRounds}</span>
        </div>
      </div>
    </div>
  );
}