import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const colors = ["red", "green", "blue", "yellow"];

export default function StroopGame() {
  const navigate = useNavigate();
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;
  const [word, setWord] = useState(colors[Math.floor(Math.random() * 4)]);
  const [color, setColor] = useState(colors[Math.floor(Math.random() * 4)]);
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
      localStorage.setItem("stroop", newScore);
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001";
        const response = await axios.post(`${API_URL}/predict`, {
          stroop_score: finalAcc,
          reaction_time: (totalTime + timeTaken) / totalRounds
        });
        localStorage.setItem("aiReport", JSON.stringify(response.data));
      } catch (err) { console.log("AI Offline"); }
      navigate("/pattern");
    } else {
      setScore(newScore);
      setTotalTime(totalTime + timeTaken);
      setRound(round + 1);
      setWord(colors[Math.floor(Math.random() * 4)]);
      setColor(colors[Math.floor(Math.random() * 4)]);
      setStartTime(Date.now());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 style={{ color: color }} className="text-6xl font-black mb-10">{word.toUpperCase()}</h1>
      <div className="grid grid-cols-2 gap-4">
        {colors.map(c => ( <button key={c} onClick={() => handleClick(c)} className="py-4 px-10 bg-slate-100 rounded-xl font-bold uppercase">{c}</button> ))}
      </div>
    </div>
  );
}