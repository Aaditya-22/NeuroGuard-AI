import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importing your specific asset
import brainLogo from "../assets/brain-logo.png";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- THE SMART HANDSHAKE ---
  // This looks at Vercel settings first. If empty, it uses your laptop address.
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    
    try {
      // We use backticks (`) and ${} to combine the Address and the Endpoint
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      alert(res.data.message);
      
      if (isLogin) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        // After registering, switch to login view so they can sign in
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Connection details:", err);
      // Helpful alert to tell you if the brain is just sleeping
      const errorMsg = err.response?.data?.message || "Server Error. The brain might be sleeping—wait 30s and try again!";
      alert(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative bg-slate-950 font-sans">
      
      {/* 🧬 INTERACTIVE ANIMATION STYLES */}
      <style>
        {`
          @keyframes slowDrift {
            0% { transform: scale(1.1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(3deg); }
            100% { transform: scale(1.1) rotate(0deg); }
          }
          @keyframes floatBrain {
            0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.2)); }
            50% { transform: translateY(-8px) scale(1.1); filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.5)); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .animate-slow-drift { animation: slowDrift 30s ease-in-out infinite; }
          .animate-float-brain { animation: floatBrain 4s ease-in-out infinite; }
          .btn-shimmer {
            background-size: 200% auto;
            transition: 0.3s;
          }
          .btn-shimmer:hover {
            background-position: right center;
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img 
          src={brainLogo} 
          alt="NeuroGuard Background"
          className="w-full h-full object-cover opacity-20 filter grayscale contrast-150 animate-slow-drift"
        />
        <div className="absolute inset-0 bg-slate-950/80"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[4rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] w-full max-w-md border border-white/10 transition-all hover:border-blue-500/30">
        
        <div className="text-center mb-10 group cursor-default">
            <div className="inline-block p-5 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-[2.5rem] mb-5 shadow-inner border border-white/5 animate-float-brain">
                <span className="text-5xl block transform group-hover:rotate-12 transition-transform duration-500">🧠</span>
            </div>
            
            <h2 className="text-4xl font-black text-white tracking-tighter transition-all group-hover:tracking-normal">
              Neuro<span className="text-blue-500 group-hover:text-blue-400 transition-colors">Guard</span>
            </h2>
            <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.5em] mt-3 group-hover:text-slate-400">
              Cognitive Health Platform
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group/input">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-5 tracking-[0.2em] group-focus-within/input:text-blue-400 transition-colors">User ID</label>
            <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-blue-500/50 focus:bg-slate-950 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all font-medium text-white placeholder:text-slate-800"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="space-y-2 group/input">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-5 tracking-[0.2em] group-focus-within/input:text-blue-400 transition-colors">Password</label>
            <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-blue-500/50 focus:bg-slate-950 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all font-medium text-white placeholder:text-slate-800"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 btn-shimmer text-white font-black py-5 rounded-3xl shadow-xl transition-all active:scale-[0.97] uppercase text-[11px] tracking-[0.2em] mt-4"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-800/50 text-center">
            <p 
              className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] cursor-pointer hover:text-white transition-all active:opacity-50"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? (
                <>Not registered? <span className="text-blue-500 underline underline-offset-4">Register here</span></>
              ) : (
                <>Already have an account? <span className="text-blue-500 underline underline-offset-4">Login here</span></>
              )}
            </p>
        </div>
      </div>
      
      <div className="relative z-10 mt-12 flex flex-col items-center gap-2">
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.6em]">
            Empowering Brain Health
          </p>
          <div className="h-[1px] w-24 bg-blue-500/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-500 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
          </div>
      </div>
    </div>
  );
}