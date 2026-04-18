import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PatternGame() {
  const navigate = useNavigate();

  // 1. GET AI DIFFICULTY FROM "POCKET"
  const aiDifficulty = parseFloat(localStorage.getItem('gameDifficulty')) || 1.0;

  const generate = () => {
    // If difficulty is high (e.g. 1.5), start numbers and gaps get bigger
    const start = Math.floor(Math.random() * (5 * aiDifficulty)) + 1;
    const diff = Math.floor(Math.random() * (5 * aiDifficulty)) + 1;

    const seq = [start];
    // Harder patterns have more numbers to look at
    const length = aiDifficulty > 1.3 ? 5 : 4; 
    
    for (let i = 1; i < length; i++) {
      seq.push(seq[i - 1] + diff);
    }

    return { seq, ans: seq[seq.length - 1] + diff };
  };

  const [data] = useState(generate());
  const [input, setInput] = useState("");
  const [startTime] = useState(Date.now()); // Start timer immediately

  const check = async () => {
    const isCorrect = Number(input) === data.ans;
    const endTime = Date.now();
    
    // Calculate Stats for AI
    const score = isCorrect ? 1.0 : 0.0;
    const reactionTime = (endTime - startTime) / 1000; // how many seconds you took
    const errorRate = isCorrect ? 0.0 : 1.0;
    const consistency = reactionTime < (5 / aiDifficulty) ? 1.0 : 0.5; // Solving in under 5s is good

    alert(isCorrect ? "AI says: Pattern Recognized!" : `AI says: Pattern missed. It was ${data.ans}`);

    try {
      // 2. SEND DATA TO THE DIARY (app.py)
      const response = await axios.post('http://127.0.0.1:5001/predict', {
        memory_score: score, // We use 'memory_score' as a generic name for 'current game score'
        reaction_time: reactionTime,
        error_rate: errorRate,
        consistency: consistency
      });

      // 3. SAVE NEW DIFFICULTY FOR NEXT GAME
      localStorage.setItem('gameDifficulty', response.data.next_difficulty);
      localStorage.setItem("pattern", score);
      
      console.log("Next Difficulty set by AI:", response.data.next_difficulty);
    } catch (err) {
      console.log("AI Server not responding, skipping sync.");
    }

    navigate("/reaction");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      {/* Smart Status Bar */}
      <div className="mb-6 text-xs font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100 shadow-sm">
        AI Complexity Level: {aiDifficulty.toFixed(1)}x
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200 text-center max-w-sm w-full border border-slate-100">
        <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">🧩 Pattern Test</h2>
        <p className="text-slate-400 text-sm font-bold uppercase mb-10 tracking-widest">Logic Assessment</p>

        <div className="flex justify-center gap-2 mb-8">
          {data.seq.map((n, i) => (
            <div key={i} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-700 font-black rounded-xl border-b-4 border-slate-200">
              {n}
            </div>
          ))}
          <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white font-black rounded-xl animate-pulse">
            ?
          </div>
        </div>

        <input
          autoFocus
          type="number"
          className="border-2 border-slate-100 p-4 rounded-2xl w-full mb-6 text-center text-2xl font-black focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
          placeholder="Next number..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
        />

        <button
          onClick={check}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          Submit to AI
        </button>
      </div>
    </div>
  );
}