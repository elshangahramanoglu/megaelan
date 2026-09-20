"use client";

import React, { useState } from "react";
import { MessageCircle, Send, Search } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const mockChats = [
  { id: 1, name: "Vüsal Əliyev", adTitle: "iPhone 13 Pro Max", lastMessage: "Salam, son qiymət nədir?", time: "14:32", unread: 2 },
  { id: 2, name: "Aygün Məmmədova", adTitle: "Mətbəx mebeli", lastMessage: "Ünvan haradır?", time: "Dünən", unread: 0 },
  { id: 3, name: "Elvin Qasımov", adTitle: "Ford Transit 2010", lastMessage: "Barter mümkündür?", time: "18.09.2026", unread: 0 },
];

export default function MessagesPage() {
  const { user } = useAppContext();
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [message, setMessage] = useState("");

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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 h-[calc(100vh-140px)] min-h-[600px]">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex h-full">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col h-full bg-slate-50">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mesajlar</h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Mesajlarda axtarış" 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {mockChats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${activeChat.id === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{chat.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-xs text-blue-600 mb-1 truncate">{chat.adTitle}</p>
                  <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-6">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex w-2/3 flex-col h-full bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {activeChat.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
              <p className="text-xs text-blue-600 hover:underline cursor-pointer">{activeChat.adTitle}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50">
            <div className="self-start max-w-[70%] bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <p className="text-gray-800">Salam, son qiymət nədir?</p>
              <span className="text-[10px] text-gray-400 mt-1 block">14:32</span>
            </div>
            <div className="self-end max-w-[70%] bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm">
              <p>Salam, qeyd olunan qiymət sondur.</p>
              <span className="text-[10px] text-blue-200 mt-1 block">14:35</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı yazın..." 
                className="flex-1 bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    setMessage("");
                  }
                }}
              />
              <button 
                onClick={() => setMessage("")}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
