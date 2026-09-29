"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { Suspense } from "react";

function MessagesContent() {
  const { user, isUserLoaded } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const targetUserId = searchParams.get('user_id');
  const targetAdId = searchParams.get('ad_id');

  const [activeChat, setActiveChat] = useState<string | null>(targetUserId);
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch unique conversations
  useEffect(() => {
    if (!isUserLoaded) return;
    if (!user) {
      router.push("/");
      return;
    }

    const fetchChats = async () => {
      try {
        // Fetch all messages where user is sender or receiver
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:users!messages_sender_id_fkey(id, name, avatar), receiver:users!messages_receiver_id_fkey(id, name, avatar)')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group into unique conversations
        const uniqueChats = new Map();
        
        // If we arrived from a link to a specific user, ensure they are in the list
        if (targetUserId && targetUserId !== user.id) {
          const { data: targetUser } = await supabase.from('users').select('id, name, avatar').eq('id', targetUserId).single();
          if (targetUser) {
            uniqueChats.set(targetUserId, {
              otherUser: targetUser,
              lastMessage: { content: "Yeni mesaj yazın...", created_at: new Date().toISOString() }
            });
          }
        }

        (data || []).forEach(msg => {
          const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;
          if (otherUser && !uniqueChats.has(otherUser.id)) {
            uniqueChats.set(otherUser.id, {
              otherUser,
              lastMessage: msg
            });
          }
        });

        setChats(Array.from(uniqueChats.values()));
      } catch (err) {
        console.error("Chats fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user, isUserLoaded, targetUserId]);

  // Fetch messages for active chat & subscribe to realtime
  useEffect(() => {
    if (!user || !activeChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat}),and(sender_id.eq.${activeChat},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      setMessages(data || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase.channel('messages_channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.sender_id === activeChat) {
          setMessages(prev => [...prev, payload.new]);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    const msgContent = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update
    const tempMsg = {
      id: Math.random().toString(),
      sender_id: user.id,
      receiver_id: activeChat,
      content: msgContent,
      created_at: new Date().toISOString(),
      ad_id: targetAdId || null
    };
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      await supabase.from('messages').insert([{
        sender_id: user.id,
        receiver_id: activeChat,
        content: msgContent,
        ad_id: targetAdId || null
      }]);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  if (!isUserLoaded || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      <h1 className="text-3xl font-black text-black mb-6">Mesajlar</h1>
      
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden flex h-[600px]">
        
        {/* Chat List Sidebar */}
        <div className={`w-full md:w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-bold text-gray-700">Söhbətlər</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-sm">Hələ mesajınız yoxdur</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.otherUser.id}
                  onClick={() => setActiveChat(chat.otherUser.id)}
                  className={`w-full p-4 flex items-center gap-3 border-b border-gray-100 transition-colors ${activeChat === chat.otherUser.id ? 'bg-blue-50' : 'hover:bg-white'}`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    {chat.otherUser.avatar ? (
                      <img src={chat.otherUser.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-bold text-gray-900 truncate">{chat.otherUser.name || 'İstifadəçi'}</h3>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage.content}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white ${!activeChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {!activeChat ? (
            <div className="text-center text-gray-400">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-bold text-lg">Bir söhbət seçin</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {chats.find(c => c.otherUser.id === activeChat)?.otherUser.avatar ? (
                    <img src={chats.find(c => c.otherUser.id === activeChat)?.otherUser.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{chats.find(c => c.otherUser.id === activeChat)?.otherUser.name || 'İstifadəçi'}</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}


export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <MessagesContent />
    </Suspense>
  );
}