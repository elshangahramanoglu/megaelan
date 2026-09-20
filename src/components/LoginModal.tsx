"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const { login } = useAppContext();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "phone") {
      setStep("otp");
    } else {
      // Login the user with the context
      login(phone);
      onClose();
      setStep("phone");
      setPhone("");
      router.push("/kabinet");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {step === "phone" ? "Giriş" : "Təsdiq kodu"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {step === "phone" ? (
                  <>
                    <p className="text-gray-600 text-sm mb-2">
                      Davam etmək üçün mobil nömrənizi daxil edin. Nömrənizə təsdiq kodu göndəriləcək.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobil nömrə
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          +994
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="50 123 45 67"
                          className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-semibold text-gray-900">+994 {phone}</span> nömrəsinə göndərilən 4 rəqəmli kodu daxil edin.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Təsdiq kodu
                      </label>
                      <input
                        type="text"
                        placeholder="0000"
                        maxLength={4}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest outline-none"
                        required
                      />
                    </div>
                  </>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-2"
                >
                  {step === "phone" ? "Davam et" : "Təsdiqlə"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
