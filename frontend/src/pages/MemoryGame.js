import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Added for AI connection

export default function MemoryGame() {
  const navigate = useNavigate();

  // 1. GET AI DIFFICULTY FROM "POCKET"
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;

  // Generate numbers based on difficulty (Higher difficulty = more numbers)
  const generate = () => {
    let arr = [];
    // If difficulty is 1.5, user gets 6 numbers (4 * 1.5)
    const count = Math.floor(4 * aiDifficulty); 
    for (let i = 0; i < count; i++) {
      arr.push(Math.floor(Math.random() * 9) + 1);
    }
    return arr;
  };

  const [numbers] = useState(generate());
  const [stage, setStage] = useState("show");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null); // To track speed

  // 2. ADAPTIVE TIMING
  useEffect(() => {
    // Higher difficulty = less time to look at numbers!
    const displayTime = 2000 / aiDifficulty; 

    const timer = setTimeout(() => {
      setStage("input");
      setStartTime(Date.now()); // Start the stopwatch when user starts typing
    }, displayTime);

    return () => clearTimeout(timer);
  }, [aiDifficulty]);

  // 3. THE SMART CHECK
  const check = async () => {
    const isCorrect = input === numbers.join("");
    const endTime = Date.now();
    
    // Calculate Stats for AI
    const score = isCorrect ? 1.0 : 0.0;
    const reactionTime = (endTime - startTime) / 1000; // seconds
    const errorRate = isCorrect ? 0.0 : 1.0;
    const consistency = reactionTime < 2.0 ? 1.0 : 0.5; // fast = consistent

    alert(isCorrect ? "AI says: Great Memory!" : `AI says: Focus! It was ${numbers.join("")}`);

    try {
      // 4. SEND DATA TO THE DIARY (app.py)
      const response = await axios.post('http://127.0.0.1:5001/predict', {
        memory_score: score,
        reaction_time: reactionTime,
        error_rate: errorRate,
        consistency: consistency
      });

      // 5. SAVE NEW DIFFICULTY FOR NEXT GAME
      localStorage.setItem('gameDifficulty', response.data.next_difficulty);
      localStorage.setItem('memory', score); // your old save
      
      console.log("New Difficulty set by AI:", response.data.next_difficulty);
    } catch (err) {
      console.log("AI Offline, using defaults");
    }

    navigate("/sequence");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Smart Status Bar */}
      <div className="mb-4 text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-4 py-1 rounded-full">
        AI Difficulty: {aiDifficulty.toFixed(1)}x
      </div>

      <h2 className="text-2xl font-black mb-4 text-slate-800">🧠 Neural Memory Test</h2>

      {stage === "show" && (
        <div className="flex gap-3 text-2xl">
          {numbers.map((n, i) => (
            <div key={i} className="w-12 h-16 flex items-center justify-center bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200">
              {n}
            </div>
          ))}
        </div>
      )}

      {stage === "input" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <p className="mb-4 text-slate-500 font-medium text-sm">Enter the pattern from memory</p>

          <input
            autoFocus
            className="border-2 border-slate-200 p-4 text-center text-3xl font-black rounded-2xl w-64 focus:border-blue-500 outline-none transition-all"
            placeholder="????"
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={check}
            className="mt-6 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Submit to AI
          </button>
        </div>
      )}
    </div>
  );
}