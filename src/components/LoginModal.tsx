"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/context/AppContext';

export default function LoginModal() {
  const { isLoginOpen, setLoginOpen, loginUser } = useAppContext();
  const [step, setStep] = useState<1 | 2>(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('+994');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Close modal cleanup
  const handleClose = () => {
    setLoginOpen(false);
    setTimeout(() => {
      setStep(1);
      setPhone('+994');
      setOtp('');
      setError('');
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (isLoginOpen && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  }, [isLoginOpen]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.replace(/\s+/g, '');
    
    if (formattedPhone.length < 12) {
      setError('Zəhmət olmasa düzgün nömrə daxil edin');
      return;
    }
    
    setError('');
    setLoading(true);

    // MOCK BYPASS (Development Only)
    if (formattedPhone === '+994000000000') {
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 1000);
      return;
    }
    
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/billing-not-enabled') {
        setError('Sistemdə SMS xidməti hələ aktivləşdirilməyib (Blaze Plan). Test üçün +994 00 000 00 00 istifadə edin.');
      } else {
        setError('Xəta baş verdi. Nömrəni yoxlayıb yenidən cəhd edin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.replace(/\s+/g, '');

    if (otp.length < 6) return;

    setError('');
    setLoading(true);

    try {
      let userPhone = formattedPhone;

      // MOCK BYPASS (Development Only)
      if (formattedPhone === '+994000000000') {
        if (otp !== '000000') {
          throw new Error('Yanlış test kodu');
        }
      } else {
        if (!confirmationResult) return;
        // 1. Verify code with Firebase
        const result = await confirmationResult.confirm(otp);
        userPhone = result.user.phoneNumber || formattedPhone;
      }

      // 2. Sync with Supabase (Check if user exists, else create)
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', userPhone)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw fetchError;
      }

      if (!existingUser) {
        // Create new user in Supabase
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ phone: userPhone, name: 'İstifadəçi' }])
          .select()
          .single();

        if (insertError) throw insertError;
        existingUser = newUser;
      }

      // 3. Update global state
      loginUser(existingUser);
      handleClose();

    } catch (err: any) {
      console.error(err);
      setError('Kod yanlışdır və ya müddəti bitib.');
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
            <div id="recaptcha-container"></div>
            
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
