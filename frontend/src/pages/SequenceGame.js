import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SequenceGame() {

  const navigate = useNavigate();

  // generate original sequence
  const generate = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(Math.floor(Math.random() * 9) + 1);
    }
    return arr;
  };

  const [sequence] = useState(generate());
  const [stage, setStage] = useState("show"); // show → input
  const [input, setInput] = useState("");
  const [jumbled, setJumbled] = useState([]);

  // shuffle function
  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // show sequence → then jumbled + input
  useEffect(() => {
    const timer = setTimeout(() => {
      setJumbled(shuffle(sequence));
      setStage("input");
    }, 2500);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = () => {
    const correct = input === sequence.join("") ? 1 : 0;

    alert(
      correct
        ? "Correct!"
        : `Wrong! Correct sequence was ${sequence.join("")}`
    );

    localStorage.setItem("sequence", correct);

    navigate("/stroop");
  };

  return (
    <div className="flex flex-col items-center mt-10">

      <h2 className="text-2xl font-bold mb-4">
        🔢 Sequence Test
      </h2>

      {/* SHOW ORIGINAL SEQUENCE */}
      {stage === "show" && (
        <>
          <p className="mb-3">Memorize this sequence</p>

          <div className="flex gap-2 text-2xl">
            {sequence.map((n, i) => (
              <div key={i} className="p-3 bg-purple-200 rounded">
                {n}
              </div>
            ))}
          </div>
        </>
      )}

      {/* SHOW JUMBLED + INPUT */}
      {stage === "input" && (
        <>
          <p className="mb-3 font-semibold">
            Now type the correct sequence:
          </p>

          <div className="flex gap-2 text-2xl mb-4">
            {jumbled.map((n, i) => (
              <div key={i} className="p-3 bg-yellow-200 rounded">
                {n}
              </div>
            ))}
          </div>

          <input
            className="border p-2 mt-2"
            placeholder="e.g. 12345"
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={check}
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </>
      )}

    </div>
  );
}