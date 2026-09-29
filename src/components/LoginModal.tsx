"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function LoginModal() {
  const { isLoginOpen, setLoginOpen, loginUser } = useAppContext();
  const [step, setStep] = useState<1 | 2>(1);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [phone, setPhone] = useState('+994');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Close modal cleanup
  const handleClose = () => {
    setLoginOpen(false);
    setTimeout(() => {
      setStep(1);
      setMode('login');
      setShowRegisterPrompt(false);
      setPhone('+994');
      setOtp('');
      setError('');
      setLoading(false);
    }, 300);
  };

    const handleSendOtp = async (e?: React.FormEvent, forceSend = false) => {
    if (e) e.preventDefault();
    const formattedPhone = phone.replace(/\s+/g, '');
    
    if (formattedPhone.length < 12) {
      setError('Zəhmət olmasa düzgün nömrə daxil edin');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (!forceSend && !showRegisterPrompt) {
        const checkRes = await fetch('/api/auth/check-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone })
        });
        const checkData = await checkRes.json();
        
        if (!checkData.exists) {
          setShowRegisterPrompt(true);
          setLoading(false);
          return;
        }
        setMode('login');
      }

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.error || 'Xəta baş verdi');
      }
    } catch (err) {
      setError('Sistem xətası. Bir az sonra yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterClick = () => {
    setMode('register');
    handleSendOtp(undefined, true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.replace(/\s+/g, '');

    if (otp.length < 6) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, otp })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Kod yanlışdır');
      }
      
      // Update global state
      loginUser(data.user);
      handleClose();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Kod yanlışdır və ya müddəti bitib.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoginOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-black">
              {step === 1 ? 'Giriş / Qeydiyyat' : 'Kodu Təsdiqləyin'}
            </h2>
            <button 
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mobil nömrəniz</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setShowRegisterPrompt(false); // Reset prompt on change
                      }}
                      placeholder="+994 50 123 45 67"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                      dir="ltr"
                      disabled={showRegisterPrompt}
                    />
                  </div>
                </div>

                {!showRegisterPrompt ? (
                  <>
                    <p className="text-sm text-gray-500">
                      Nömrənizə 6 rəqəmli təsdiq kodu göndəriləcək.
                    </p>
                    <button 
                      type="submit" 
                      disabled={loading || phone.length < 12}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Davam et'}
                    </button>
                  </>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl text-center">
                    <p className="text-orange-800 font-medium mb-4">
                      Bu nömrə sistemdə yoxdur. Qeydiyyatdan keçmək istəyirsiniz?
                    </p>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setShowRegisterPrompt(false)}
                        className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Ləğv et
                      </button>
                      <button 
                        type="button"
                        onClick={handleRegisterClick}
                        className="flex-1 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-700 shadow-md flex items-center justify-center"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Qeydiyyatdan Keç'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">6 rəqəmli kod</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="XXXXXX"
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold tracking-widest focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-center text-lg"
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-500 text-center">
                    <span className="font-bold text-black">{phone}</span> nömrəsinə göndərilən kodu daxil edin.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || otp.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Təsdiqlə və Daxil Ol'}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm font-bold text-blue-600 hover:underline"
                >
                  Nömrəni dəyiş
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
