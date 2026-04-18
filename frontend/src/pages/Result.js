import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const [aiReport, setAiReport] = useState(null);

  const memory = Number(localStorage.getItem("memory") || 0);
  const sequence = Number(localStorage.getItem("sequence") || 0);
  const stroop = Number(localStorage.getItem("stroop") || 0);
  const pattern = Number(localStorage.getItem("pattern") || 0);
  const reaction = Number(localStorage.getItem("reaction") || 0);

  useEffect(() => {
    const saved = localStorage.getItem("aiReport");
    if (saved) setAiReport(JSON.parse(saved));
  }, []);

  const data = [
    { name: "Memory", value: Math.round(memory * 100), color: "#3b82f6" },
    { name: "Seq", value: Math.round(sequence * 100), color: "#8b5cf6" },
    { name: "Stroop", value: Math.round((stroop / 5) * 100), color: "#f59e0b" },
    { name: "Logic", value: Math.round(pattern * 100), color: "#ec4899" },
    { name: "Speed", value: reaction === 0 ? 0 : Math.round(Math.max(10, 100 - (reaction / 10))), color: "#10b981" }
  ];

  const handleReturn = () => {
    localStorage.removeItem("aiReport");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-black text-slate-900 mb-8">AI Diagnostic <span className="text-blue-600">Report</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 text-center">
            {aiReport ? (
              <>
                <p className="text-[10px] font-bold text-blue-500 mb-2 uppercase tracking-widest">AI Risk Score</p>
                <h2 className="text-8xl font-black mb-2 text-slate-900">{aiReport.probability}</h2>
                <div className="text-xl font-bold mb-6 text-blue-600">{aiReport.risk_level}</div>
                <div className="text-left bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">AI Insights</p>
                  {aiReport.explanation?.map((note, i) => (
                    <p key={i} className="text-sm text-slate-600 italic mb-1 font-medium">• {note}</p>
                  ))}
                </div>
              </>
            ) : <p className="text-slate-400 italic py-10">Waiting for game data...</p>}
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100" style={{ height: "450px" }}>
             <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest">Cognitive Pillars (%)</h3>
             <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                  <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={35}>
                    {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-12 text-center">
          <button onClick={handleReturn} className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-widest">Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}