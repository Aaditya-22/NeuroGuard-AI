import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const [aiReport, setAiReport] = useState(null);

  // Pulling Data
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
    { name: "Memory", value: memory * 100, color: "#3b82f6" },
    { name: "Sequence", value: sequence * 100, color: "#8b5cf6" },
    { name: "Stroop", value: (stroop / 5) * 100, color: "#f59e0b" },
    { name: "Logic", value: pattern * 100, color: "#ec4899" },
    { name: "Speed", value: reaction === 0 ? 0 : Math.max(0, 100 - reaction / 20), color: "#10b981" }
  ];

  const handleReturn = () => {
    ["memory", "sequence", "stroop", "pattern", "reaction", "aiReport"].forEach(k => localStorage.removeItem(k));
    navigate("/dashboard"); // Redirects to Dashboard without logging out
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-black text-slate-900 mb-8">AI Diagnostic <span className="text-blue-600">Report</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
            {aiReport ? (
              <>
                <p className="text-[10px] font-bold text-blue-500 mb-2 uppercase tracking-widest">Risk Probability</p>
                <h2 className="text-7xl font-black mb-2">{aiReport.probability}</h2>
                <div className="text-xl font-bold mb-6 text-blue-600">{aiReport.risk_level}</div>
                <div className="text-left bg-slate-50 p-5 rounded-3xl border">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">AI Insights</p>
                  {aiReport.explanation?.map((note, i) => (
                    <p key={i} className="text-sm text-slate-600 italic mb-1 font-medium">• {note}</p>
                  ))}
                </div>
              </>
            ) : <p className="text-slate-400 italic py-10">No data found.</p>}
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border h-80">
             <h3 className="text-xs font-black text-slate-800 mb-6 uppercase tracking-widest">Cognitive Pillars</h3>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}><XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} /><Tooltip cursor={{fill: 'transparent'}} /><Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={35}>{data.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart>
             </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-12 text-center">
          <button onClick={handleReturn} className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-widest">Return to Dashboard</button>
        </div>
      </div>
    </div>
  );
}