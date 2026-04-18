import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SequenceGame() {
  const navigate = useNavigate();
  const [sequence] = useState([...Array(5)].map(() => Math.floor(Math.random() * 9) + 1));
  const [stage, setStage] = useState("show");
  const [input, setInput] = useState("");
  const [jumbled, setJumbled] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setJumbled([...sequence].sort(() => Math.random() - 0.5));
      setStage("input");
      setStartTime(Date.now());
    }, 2500);
    return () => clearTimeout(timer);
  }, [sequence]);

  const check = async () => {
    const isCorrect = input === sequence.join("");
    const score = isCorrect ? 1.0 : 0.0;
    const reactionTime = (Date.now() - startTime) / 1000;
    
    localStorage.setItem("sequence", score);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001";
      const response = await axios.post(`${API_URL}/predict`, {
        sequence_score: score,
        reaction_time: reactionTime
      });
      localStorage.setItem("aiReport", JSON.stringify(response.data));
    } catch (err) { console.log("AI Offline"); }
    navigate("/stroop");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">🔢 Sequence Test</h2>
      {stage === "show" ? (
        <div className="flex gap-2 text-2xl">
          {sequence.map((n, i) => ( <div key={i} className="p-3 bg-purple-200 rounded">{n}</div> ))}
        </div>
      ) : (
        <>
          <div className="flex gap-2 text-2xl mb-4">
            {jumbled.map((n, i) => ( <div key={i} className="p-3 bg-yellow-200 rounded">{n}</div> ))}
          </div>
          <input className="border p-2" onChange={(e) => setInput(e.target.value)} />
          <button onClick={check} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded">Submit</button>
        </>
      )}
    </div>
  );
}