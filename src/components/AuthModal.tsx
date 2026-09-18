import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Sparkles, ArrowRight, ShieldCheck, Smartphone, RefreshCw, Check, Copy } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    loginUserWithPassword, 
    signupUserWithPassword,
    sendOtpCode,
    verifyOtpCode,
    settings,
    showToast
  } = useStore();

  const [tab, setTab] = useState<'login' | 'signup' | 'otp'>('login');

  // Login form state
  const [loginId, setLoginId] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Signup form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dormOrBuilding, setDormOrBuilding] = useState<string>(
    settings.campusDeliveryLocations[0] || 'Hostel Block A'
  );
  const [roomOrSpot, setRoomOrSpot] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('knot' + Math.floor(1000 + Math.random() * 9000));
  const [passwordCopied, setPasswordCopied] = useState<boolean>(false);

  // OTP Form state
  const [otpIdentifier, setOtpIdentifier] = useState<string>('');
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState<string>('');

  if (activeModal !== 'auth') return null;

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pass = 'Knot';
    for (let i = 0; i < 5; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSignupPassword(pass);
    showToast('✨ Unique password generated!');
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(signupPassword);
    setPasswordCopied(true);
    showToast('Password copied to clipboard!');
    setTimeout(() => setPasswordCopied(false), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPassword.trim()) return;
    loginUserWithPassword(loginId, loginPassword);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !signupPassword.trim()) return;
    signupUserWithPassword(name, email, phone, signupPassword, dormOrBuilding, roomOrSpot);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpIdentifier.trim()) return;
    const code = sendOtpCode(otpIdentifier);
    setSentOtpCode(code);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentOtpCode || !enteredOtp.trim()) return;
    verifyOtpCode(otpIdentifier, enteredOtp, sentOtpCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col border-2 border-rose-200">
        
        {/* Header */}
        <div className="yarn-gradient-vibrant p-6 text-white text-center relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-2xl mb-2 shadow-inner">
            🧶
          </div>

          <h2 className="text-2xl font-black">
            {tab === 'login' ? 'Student Sign In' : tab === 'signup' ? 'Create Student Account' : '📲 OTP Verification'}
          </h2>
          <p className="text-xs text-rose-100 mt-1 font-medium">
            {tab === 'login' 
              ? 'Enter your mobile number or email + unique password' 
              : tab === 'signup'
              ? 'Register with mobile/email & unique password'
              : 'Login via 4-digit SMS / Email OTP code'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex bg-black/20 rounded-xl p-1 mt-4 text-[11px] font-bold">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                tab === 'login' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                tab === 'signup' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Register Account
            </button>
            <button
              onClick={() => setTab('otp')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                tab === 'otp' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              OTP Login
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          
          {/* TAB 1: PASSWORD LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                  Mobile Number OR Email:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210 or aarav@university.edu"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  Your Unique Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                <span>Demo Student Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginId('aarav@university.edu');
                    setLoginPassword('student123');
                  }}
                  className="text-rose-600 font-extrabold underline hover:text-rose-700"
                >
                  Auto-Fill Demo
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-xs transition-all"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: SIGNUP & GENERATE UNIQUE PASSWORD */}
          {tab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email ID:</label>
                  <input
                    type="email"
                    required
                    placeholder="sanya@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dorm Location:</label>
                  <select
                    value={dormOrBuilding}
                    onChange={(e) => setDormOrBuilding(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                  >
                    {settings.campusDeliveryLocations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Room No.:</label>
                  <input
                    type="text"
                    placeholder="Room 304"
                    value={roomOrSpot}
                    onChange={(e) => setRoomOrSpot(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Unique Password Generator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Unique Account Password:</span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
                  >
                    {passwordCopied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{passwordCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">Save this unique password to sign in later anytime!</p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-xs transition-all pt-2"
              >
                <span>Complete Student Registration</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: OTP AUTHENTICATION */}
          {tab === 'otp' && (
            <div className="space-y-4">
              {!sentOtpCode ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-rose-500" />
                      Mobile Number or Email Address:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98765 43210 or devansh@campus.edu"
                      value={otpIdentifier}
                      onChange={(e) => setOtpIdentifier(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-xs transition-all"
                  >
                    <span>Send 4-Digit OTP Code</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-2">
                    <div className="text-xs font-bold text-rose-900">
                      OTP Sent to: <span className="underline">{otpIdentifier}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-rose-300 inline-block">
                      <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Simulated OTP Code</div>
                      <div className="text-2xl font-black text-rose-600 font-mono tracking-widest">{sentOtpCode}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Enter 4-Digit OTP Verification Code:
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="Enter code (or use 7892 / 1234)..."
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-3 text-center text-lg font-black font-mono tracking-widest outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-xs transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify OTP & Sign In</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
