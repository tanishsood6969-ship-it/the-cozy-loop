import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, User, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

export const SecretAdminLoginPage: React.FC = () => {
  const { loginAdminWithCredentials, settings } = useStore();
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdminWithCredentials(usernameInput, pinInput);
    if (success) {
      window.location.hash = 'admin';
    }
  };

  const handleReturnToStore = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        
        {/* Top Return Button */}
        <button
          onClick={handleReturnToStore}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Customer Store</span>
        </button>

        {/* Shield Header */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-purple-500/20">
            <Lock className="w-3 h-3" />
            <span>Private Store Owner Portal</span>
          </div>
          <h2 className="text-3xl font-black">{settings.storeName}</h2>
          <p className="text-xs text-stone-400 mt-1">
            Access restricted to authorized business owner credentials.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-400" /> Owner Username / ID:
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. admin"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-stone-800/90 border border-stone-700 focus:border-purple-500 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-purple-400" /> Security Password / PIN:
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-stone-800/90 border border-stone-700 focus:border-purple-500 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-purple-950 flex items-center justify-center gap-2 text-xs transition-all pt-3"
          >
            <span>Login to Owner Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-stone-800/50 p-3 rounded-2xl border border-stone-800 text-[11px] text-stone-400 space-y-1 text-left">
          <div className="font-bold text-stone-300">🔑 Default Credentials:</div>
          <div>• Username: <code className="text-purple-300">admin</code></div>
          <div>• Password / PIN: <code className="text-purple-300">admin123</code></div>
        </div>
      </div>
    </div>
  );
};
