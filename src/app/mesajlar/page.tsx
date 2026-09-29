"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

export default function MessagesPage() {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-20 text-center flex flex-col items-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mesajlar bölməsi</h1>
        <p className="text-gray-500 mb-6">Mesajlaşmaq üçün əvvəlcə sayta daxil olmalısınız.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-20 text-center flex flex-col items-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <MessageCircle className="w-12 h-12 text-blue-400" />
      </div>
      <h1 className="text-3xl font-black text-black mb-3">Mesajlar</h1>
      <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
        Mesajlaşma sistemi hazırda inkişaf mərhələsindədir. Tezliklə aktiv olacaq!
      </p>
      <Link 
        href="/"
        className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25"
      >
        Ana səhifəyə qayıt
      </Link>
    </div>
  );
}
