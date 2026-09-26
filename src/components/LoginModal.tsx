"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, Loader2, User } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function LoginModal() {
  const { isLoginOpen, setLoginOpen, loginUser } = useAppContext();
  const [step, setStep] = useState<1 | 2>(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('+994');
  const [otp, setOtp] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Close modal cleanup
  const handleClose = () => {
    setLoginOpen(false);
    setTimeout(() => {
      setStep(1);
      setPhone('+994');
      setOtp('');
      setAd('');
      setSoyad('');
      setIsNewUser(false);
      setError('');
      setLoading(false);
    }, 300);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.replace(/\s+/g, '');
    
    if (formattedPhone.length < 12) {
      setError('Zəhmət olmasa düzgün nömrə daxil edin');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Xəta baş verdi');
      }
      
      setIsNewUser(data.isNewUser);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Xəta baş verdi. Nömrəni yoxlayıb yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.replace(/\s+/g, '');

    if (otp.length < 6) return;
    if (isNewUser && (!ad.trim() || !soyad.trim())) {
      setError('Zəhmət olmasa Ad və Soyadınızı daxil edin');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formattedPhone, 
          otp,
          ...(isNewUser && { ad, soyad })
        })
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
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+994 50 123 45 67"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                      dir="ltr"
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Nömrənizə 6 rəqəmli təsdiq kodu göndəriləcək.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || phone.length < 12}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kodu Göndər'}
                </button>
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
                  <p className="mt-3 text-sm text-gray-500 text-center mb-6">
                    <span className="font-bold text-black">{phone}</span> nömrəsinə göndərilən kodu daxil edin.
                  </p>
                </div>

                {isNewUser && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Adınız</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={ad}
                          onChange={(e) => setAd(e.target.value)}
                          placeholder="Adınızı daxil edin"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Soyadınız</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={soyad}
                          onChange={(e) => setSoyad(e.target.value)}
                          placeholder="Soyadınızı daxil edin"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={loading || otp.length < 6 || (isNewUser && (!ad.trim() || !soyad.trim()))}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isNewUser ? 'Qeydiyyatı Tamamla' : 'Təsdiqlə və Daxil Ol')}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm font-bold text-blue-600 hover:underline mt-2"
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
