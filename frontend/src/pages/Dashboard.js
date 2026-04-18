import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import brainLogo from "../assets/brain-logo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);

  // 1. TRACK SCROLL POSITION
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPos(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. CALCULATE DYNAMIC STYLES
  const zoomScale = 1 + scrollPos / 300; 
  const brainOpacity = Math.max(0.05, 0.25 - scrollPos / 2000);
  const rotation = scrollPos / 50;

  const games = [
    { name: "Memory Blitz", path: "/memory", icon: "🧠", color: "from-blue-500 to-indigo-600" },
    { name: "Sequence Master", path: "/sequence", icon: "🔢", color: "from-purple-500 to-pink-600" },
    { name: "Stroop Focus", path: "/stroop", icon: "🎯", color: "from-amber-500 to-orange-600" },
    { name: "Logic Pattern", path: "/pattern", icon: "🧩", color: "from-emerald-500 to-teal-600" },
    { name: "Reaction Speed", path: "/reaction", icon: "⚡", color: "from-rose-500 to-red-600" },
  ];

  return (
    <div className="relative min-h-[300vh] bg-slate-950 text-white overflow-x-hidden">
      
      {/* 🧠 THE ZOOMING SCROLL BACKGROUND */}
      <div 
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `scale(${zoomScale}) rotate(${rotation}deg)`,
          opacity: brainOpacity,
          transition: "transform 0.1s ease-out", 
          perspective: "1000px"
        }}
      >
        <img 
          src={brainLogo} 
          alt="Background Brain" 
          className="w-full h-full object-contain filter brightness-125 contrast-125"
        />
      </div>

      {/* OVERLAY GRADIENT */}
      <div className="fixed inset-0 z-1 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950 pointer-events-none"></div>

      {/* 3. DASHBOARD CONTENT */}
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <header className="py-20 text-center">
            <h1 className="text-6xl font-black tracking-tighter mb-4 animate-pulse">
                Neuro<span className="text-blue-500">Guard</span> Dashboard
            </h1>
            <p className="text-slate-400 uppercase tracking-[0.5em] text-xs font-bold">
                Select a Cognitive Diagnostic Module
            </p>
            <div className="mt-10 animate-bounce text-blue-500 text-2xl">↓ Scroll to Explore ↓</div>
        </header>

        {/* GRID OF GAMES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-40">
          {games.map((game, i) => (
            <div
              key={i}
              onClick={() => navigate(game.path)}
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] cursor-pointer hover:border-blue-500/50 transition-all hover:-translate-y-2 shadow-2xl"
            >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {game.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                <p className="text-slate-500 text-sm font-medium">Start medical assessment module {i+1}...</p>
                <div className={`absolute -z-10 inset-0 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${game.color} rounded-full`}></div>
            </div>
          ))}

          {/* 📊 THE FINAL REPORT CARD */}
          <div
            onClick={() => navigate("/result")}
            className="group relative bg-white/5 backdrop-blur-2xl border border-blue-500/20 p-8 rounded-[3rem] cursor-pointer hover:border-blue-500 transition-all hover:-translate-y-2 shadow-2xl"
          >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform border border-white/10">
                  📊
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">View Final Report</h3>
              <p className="text-blue-400 text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">Analyze Trends →</p>
              <div className="absolute -z-10 inset-0 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* --- 🏥 NEURAL KNOWLEDGE BASE SECTION --- */}
        <div className="mt-20 mb-20 border-t border-white/10 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-5xl font-black tracking-tighter">Neural <span className="text-blue-500">Knowledge Base</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Understanding Alzheimer's Disease</p>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">Medical Insights v1.0</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* WHAT IS IT? */}
            <div className="md:col-span-8 bg-slate-900/60 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">🧬</span>
                <h3 className="text-3xl font-black">What is Alzheimer's?</h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg italic">
                Alzheimer's is a progressive brain disorder that slowly destroys memory and thinking skills. It's characterized by the buildup of <span className="text-white font-bold">amyloid plaques</span> and <span className="text-white font-bold">tau tangles</span>, leading to the loss of connections between nerve cells.
              </p>
            </div>

            {/* CAUSES */}
            <div className="md:col-span-4 bg-gradient-to-br from-indigo-950 to-slate-900 p-8 rounded-[3.5rem] border border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">⚠️ <span className="uppercase tracking-widest text-xs">Primary Causes</span></h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">01</span> Genetic factors (APOE-e4)</li>
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">02</span> Age-related inflammation</li>
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">03</span> Protein misfolding</li>
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">04</span> Cardiovascular health links</li>
              </ul>
            </div>

            {/* EFFECTS */}
            <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-8 rounded-[3.5rem] border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-rose-500">Neural Effects</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Severe cognitive decline, disorientation, difficulty with spatial relationships, and eventual loss of motor functions and executive control.
              </p>
            </div>

            {/* HOW THIS SITE HELPS */}
            <div className="md:col-span-8 bg-blue-600 p-0.5 rounded-[3.5rem] shadow-2xl shadow-blue-500/20">
              <div className="bg-slate-950 h-full w-full rounded-[3.4rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[80px]"></div>
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <span className="animate-pulse">🟢</span> How NeuroGuard Helps
                </h3>
                <p className="text-slate-400 text-md leading-relaxed">
                  Early detection is key to slowing progression. NeuroGuard uses <span className="text-blue-400 font-bold underline decoration-blue-500/30 underline-offset-4">AI Predictive Modeling</span> to monitor subtle changes in reaction time and memory. Our goal is to identify risk levels before physical symptoms manifest, allowing for earlier lifestyle and medical intervention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <section className="py-40 text-center border-t border-white/5">
            <h2 className="text-4xl font-black mb-6">AI System Status: <span className="text-emerald-500">Ready</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto italic">
                The NeuroGuard AI is currently monitoring your neural inputs. Proceed with the tests for a full diagnostic report.
            </p>
        </section>
      </div>
    </div>
  );
}