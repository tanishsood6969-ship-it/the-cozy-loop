import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Lock, ShieldCheck, KeyRound, User, ArrowRight } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const { activeModal, setActiveModal, loginAdminWithCredentials } = useStore();
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');

  if (activeModal !== 'adminAuth') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdminWithCredentials(usernameInput, pinInput);
    if (success) {
      window.location.hash = 'admin';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm bg-stone-900 text-white rounded-3xl shadow-2xl border border-purple-500/40 p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 bg-stone-800 hover:bg-stone-700 text-stone-400 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-rose-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-purple-500/30">
            <Lock className="w-3 h-3" />
            <span>Owner Protection</span>
          </div>
          <h2 className="text-2xl font-black">Owner Portal Login</h2>
          <p className="text-xs text-stone-400 mt-1">
            Enter your secret owner credentials to unlock admin manager view.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div>
            <label className="block text-[11px] font-bold text-stone-400 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-purple-400" /> Username:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 focus:border-purple-500 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-stone-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-400 mb-1 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-purple-400" /> Security PIN:
            </label>
            <input
              type="password"
              required
              placeholder="e.g. admin123"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 focus:border-purple-500 rounded-2xl px-3.5 py-2 text-xs text-white font-mono placeholder-stone-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-extrabold py-3 px-4 rounded-2xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 text-xs transition-all pt-2"
          >
            <span>Authenticate Admin View</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-stone-500">
          🔑 Default Credentials: Username <code className="text-purple-300">admin</code> • PIN <code className="text-purple-300">admin123</code>
        </p>
      </div>
    </div>
  );
};
