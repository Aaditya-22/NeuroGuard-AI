import { useState } from "react"; // Removed useEffect here
import { useNavigate } from "react-router-dom";
import axios from "axios";

const colors = ["red", "green", "blue", "yellow"];

export default function StroopGame() {
  const navigate = useNavigate();

  // 1. GET AI DIFFICULTY
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;

  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const [word, setWord] = useState(randomColor());
  const [color, setColor] = useState(randomColor());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState(Date.now());
  const [totalReactionTime, setTotalReactionTime] = useState(0);

  // 2. ADAPTIVE ROUNDS
  const totalRounds = Math.floor(5 * aiDifficulty);

  const nextRound = () => {
    setWord(randomColor());
    setColor(randomColor());
    setStartTime(Date.now());
  };

  const handleClick = async (selectedColor) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    let newScore = score;

    if (selectedColor === color) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    setTotalReactionTime(prev => prev + timeTaken);

    if (round >= totalRounds) {
      const finalAccuracy = newScore / totalRounds;
      const avgTime = (totalReactionTime + timeTaken) / totalRounds;
      const consistency = (finalAccuracy > 0.8 && avgTime < 1.5) ? 1.0 : 0.5;

      try {
        const response = await axios.post('http://127.0.0.1:5001/predict', {
          memory_score: finalAccuracy,
          reaction_time: avgTime,
          error_rate: 1 - finalAccuracy,
          consistency: consistency
        });

        localStorage.setItem('gameDifficulty', response.data.next_difficulty);
        localStorage.setItem("stroop", newScore);
        
      } catch (err) {
        console.log("AI Offline");
      }

      navigate("/pattern");
    } else {
      setRound(round + 1);
      nextRound();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="mb-10 flex items-center gap-3 bg-amber-50 border border-amber-100 px-6 py-2 rounded-full shadow-sm">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
        <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">
          AI Attention Monitor: {aiDifficulty.toFixed(1)}x
        </span>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center max-w-sm w-full">
        <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">🎯 Stroop Test</h2>
        <p className="text-slate-400 text-xs font-bold uppercase mb-12 tracking-widest text-left ml-2">Select the Ink Color:</p>
        
        <div className="h-32 flex items-center justify-center mb-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <h1 style={{ color: color }} className="text-6xl font-black">{word.toUpperCase()}</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {colors.map((c) => (
            <button key={c} onClick={() => handleClick(c)} className="py-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-900 font-black text-slate-700 uppercase text-xs tracking-widest transition-all active:scale-95">
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