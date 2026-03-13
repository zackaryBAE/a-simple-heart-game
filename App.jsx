import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from './services/authService';
import Login from './components/Login';
import GameBoard from './components/GameBoard';
import DatabaseViewer from './components/DatabaseViewer';
import ShootingStars from './components/ShootingStars';
import { LogOut, Heart, Github, ExternalLink, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Main App Component.
 * Enhanced with Framer Motion for overall page transitions and refined UI.
 * Uses a simple CSS-based animated background for reliability.
 */
function App() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showDbViewer, setShowDbViewer] = useState(false);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setTimeout(() => setIsInitializing(false), 1000); // Small delay for smooth intro
  }, []);

  const handleLogin = (newUser) => setUser(newUser);
  const handleLogout = () => {
    logout();
    setUser(null);
  };
  const handleUpdateUser = (updatedUser) => setUser(updatedUser);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center relative z-10"
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-red-400 rounded-full blur-2xl"
            />
            <Heart className="w-20 h-20 text-red-500 relative z-10 fill-current" />
          </div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black text-white mt-8 tracking-tighter"
          >
            HEART GAME <span className="text-red-500">2026</span>
          </motion.h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 selection:bg-red-500/30 selection:text-white">
      {/* Background Layer */}
      <ShootingStars />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              HEART<span className="text-red-500">GAME</span>
            </h1>
          </motion.div>

          <AnimatePresence>
            {user && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-6"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[0.6rem] font-black text-red-400 uppercase tracking-[0.2em]">Agent Identity</span>
                  <span className="text-sm font-bold text-slate-200">{user.username}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 p-2.5 rounded-2xl transition-all border border-white/10 hover:border-red-500/30 shadow-xl"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <Login onLogin={handleLogin} />
            </motion.div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <GameBoard user={user} onUpdateUser={handleUpdateUser} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Database Viewer Toggle (Restricted to Admin only) */}
      {user && user.username === 'admin' && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDbViewer(true)}
          className="fixed bottom-8 left-8 z-[60] bg-gray-800 text-white p-4 rounded-full shadow-2xl border-2 border-white/10 hover:bg-gray-900 transition-colors"
          title="View Live Data Collection"
        >
          <Database className="w-6 h-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {showDbViewer && (
          <DatabaseViewer onClose={() => setShowDbViewer(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#fff5f5] border-t border-red-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-gray-800">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center space-x-3 text-red-500 font-black text-2xl tracking-tighter">
                <Heart className="w-8 h-8 fill-current" />
                <span>HEART EXPLORER</span>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed max-w-sm">
                A high-fidelity educational game exploring <span className="text-red-500 font-bold">interoperability</span> and <span className="text-red-500 font-bold">virtual identity</span> through Marc Conrad's Heart API.
              </p>
              <div className="flex space-x-4">
                <motion.a whileHover={{ y: -3 }} href="#" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a whileHover={{ y: -3 }} href="https://marcconrad.com/uob/heart/doc.php" target="_blank" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Architecture</h4>
                <ul className="text-sm font-bold text-gray-600 space-y-3">
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Low Coupling</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">High Cohesion</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Event-Driven</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Technology</h4>
                <ul className="text-sm font-bold text-gray-600 space-y-3">
                  <li className="hover:text-red-500 cursor-pointer transition-colors">React 18</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Framer Motion</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Tailwind CSS</li>
                </ul>
              </div>
              <div className="space-y-4 col-span-2 sm:col-span-1">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Identity</h4>
                <ul className="text-sm font-bold text-gray-600 space-y-3">
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Auth Cookies</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Session State</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Persistence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
