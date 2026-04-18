import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Memory", path: "/memory", icon: "🧠" },
    { name: "Sequence", path: "/sequence", icon: "🔢" },
    { name: "Pattern", path: "/pattern", icon: "🧩" },
    { name: "Stroop", path: "/stroop", icon: "🎨" },
    { name: "Reaction", path: "/reaction", icon: "⚡" },
  ];

  const handleNavigation = (path) => {
    if (location.pathname === path) return;
    
    setIsChanging(true);
    setTimeout(() => {
      navigate(path);
      setIsChanging(false);
    }, 600);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      
      {/* --- DARK SIDEBAR (LEFT) --- */}
      <aside className="w-64 border-r border-slate-200 bg-[#0a0f1e] flex flex-col z-50 shadow-xl">
        
        <div className="p-8 mb-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigation('/dashboard')}
            className="cursor-pointer flex flex-col items-center text-center gap-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative text-5xl drop-shadow-2xl">🧠</div>
            </div>
            <div className="mt-2">
              <h1 className="text-sm font-black tracking-[0.2em] text-white">NEUROGUARD</h1>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">AI Diagnostic</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === item.path 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-bold">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-white"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-xs shadow-lg">AV</div>
            <div className="text-left">
              <p className="text-xs font-bold">A. Verma</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Researcher</p>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-20 left-4 right-4 bg-[#1a2236] border border-white/10 p-2 rounded-2xl shadow-2xl z-[60]"
              >
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <span>🚪</span> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* --- LIGHT GAME AREA (RIGHT) --- */}
      <main className="flex-1 overflow-y-auto relative bg-white">
        
        <AnimatePresence>
          {isChanging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
              />
              <p className="text-blue-600 font-mono text-[10px] uppercase tracking-[0.4em] font-bold">
                Analyzing Neural Patterns...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 h-full p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;