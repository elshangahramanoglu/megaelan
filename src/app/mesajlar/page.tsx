"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { MessageCircle, Send, ArrowLeft, Loader2, User as UserIcon, Check, CheckCheck, Clock, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function MessagesContent() {
  const { user, isUserLoaded } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  let targetUserId = searchParams.get('user_id');
  if (targetUserId === 'undefined' || targetUserId === 'null') targetUserId = null;
  let targetAdId = searchParams.get('ad_id');
  if (targetAdId === 'undefined' || targetAdId === 'null') targetAdId = null;

  const [activeChat, setActiveChat] = useState<string | null>(targetUserId);
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refreshChatsTrigger, setRefreshChatsTrigger] = useState(0);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetUserId) setActiveChat(targetUserId);
  }, [targetUserId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // 1. Fetch unique conversations
  useEffect(() => {
    if (!isUserLoaded) return;
    if (!user) return router.push("/");

    const fetchChats = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const deletedChats = JSON.parse(localStorage.getItem('deleted_chats_time') || '{}');
        const messagesData = (data || []).filter(msg => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const delTime = deletedChats[otherUserId];
          return !delTime || new Date(msg.created_at) > new Date(delTime);
        });
        const userIds = new Set<string>();
        if (targetUserId && targetUserId !== user.id) userIds.add(targetUserId);
        
        messagesData.forEach(msg => {
          if (msg.sender_id !== user.id) userIds.add(msg.sender_id);
          if (msg.receiver_id !== user.id) userIds.add(msg.receiver_id);
        });
        
        let usersMap = new Map();
        if (userIds.size > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, name, avatar, phone')
            .in('id', Array.from(userIds));
            
          (usersData || []).forEach(u => usersMap.set(u.id, u));
        }

        const uniqueChats = new Map();
        
        if (targetUserId && targetUserId !== user.id) {
          if (!usersMap.has(targetUserId)) {
            const { data: fallbackUser } = await supabase.from('users').select('id, name, avatar, phone').eq('id', targetUserId).single();
            if (fallbackUser) usersMap.set(targetUserId, fallbackUser);
            else usersMap.set(targetUserId, { id: targetUserId, name: 'Naməlum İstifadəçi', phone: '', avatar: '' });
          }
          uniqueChats.set(targetUserId, {
            otherUser: usersMap.get(targetUserId),
            lastMessage: { content: "Yeni mesaj yazın...", created_at: new Date().toISOString() },
            unreadCount: 0
          });
        }

        messagesData.forEach(msg => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          
          if (!uniqueChats.has(otherUserId)) {
            uniqueChats.set(otherUserId, {
              otherUser: usersMap.has(otherUserId) ? usersMap.get(otherUserId) : { id: otherUserId, name: 'İstifadəçi', phone: '', avatar: '' },
              lastMessage: msg,
              unreadCount: 0
            });
          }
          
          // Count unread
          if (msg.receiver_id === user.id && !msg.is_read) {
            uniqueChats.get(otherUserId).unreadCount += 1;
          }
        });

        // Sort chats by lastMessage created_at
        const sortedChats = Array.from(uniqueChats.values()).sort((a, b) => 
          new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
        );
        
        setChats(sortedChats);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user, isUserLoaded, targetUserId, refreshChatsTrigger]);

  // 2. Fetch messages for active chat & mark as read
  useEffect(() => {
    if (!user || !activeChat) return;

    const loadActiveChat = async () => {
      // Fetch messages
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat}),and(sender_id.eq.${activeChat},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      const deletedChats = JSON.parse(localStorage.getItem('deleted_chats_time') || '{}');
      const delTime = deletedChats[activeChat];
      const visibleData = data?.filter(msg => !delTime || new Date(msg.created_at) > new Date(delTime)) || [];
      
      setMessages(visibleData);
      setTimeout(scrollToBottom, 150);

      // Mark unread as read using RPC
      try {
        await supabase.rpc('mark_messages_as_read', { p_sender_id: activeChat, p_receiver_id: user.id });
      } catch(e) {}
    };

    loadActiveChat();
  }, [user, activeChat]);

  // 3. Realtime Subscription (Insert + Update)
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase.channel('messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        
        // If it belongs to our active chat
        if (
          (msg.sender_id === activeChat && msg.receiver_id === user.id) ||
          (msg.sender_id === user.id && msg.receiver_id === activeChat)
        ) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setTimeout(scrollToBottom, 100);
          
          // If we received it while chat is open, immediately mark as read
          if (msg.sender_id === activeChat && msg.receiver_id === user.id) {
            supabase.rpc('mark_messages_as_read', { p_sender_id: activeChat, p_receiver_id: user.id });
          }
        }

        // Update sidebar
        setChats(prev => {
           const updated = [...prev];
           const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
           const idx = updated.findIndex(c => c.otherUser.id === otherId);
           if (idx > -1) {
              updated[idx].lastMessage = msg;
              if (msg.receiver_id === user.id && activeChat !== otherId) {
                updated[idx].unreadCount = (updated[idx].unreadCount || 0) + 1;
              }
              // Move to top
              const [chatToMove] = updated.splice(idx, 1);
              updated.unshift(chatToMove);
           } else {
              setTimeout(() => setRefreshChatsTrigger(t => t + 1), 100);
           }
           return updated;
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        // Update read status in UI
        setMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    const msgContent = newMessage.trim();
    setNewMessage("");

    const tempMsg = {
      id: uuidv4(),
      sender_id: user.id,
      receiver_id: activeChat,
      content: msgContent,
      created_at: new Date().toISOString(),
      is_read: false,
      ad_id: targetAdId || null
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);
    
    setChats(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(c => c.otherUser.id === activeChat);
      if (idx > -1) {
        updated[idx].lastMessage = tempMsg;
        const [chatToMove] = updated.splice(idx, 1);
        updated.unshift(chatToMove);
      }
      return updated;
    });

    try {
      const { error: insertError } = await supabase.from('messages').insert([{
        id: tempMsg.id,
        sender_id: user.id,
        receiver_id: activeChat,
        content: msgContent,
        ad_id: targetAdId || null
      }]);
      if (insertError) {
        alert("Xəta: " + insertError.message);
        setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      }
    } catch (err: any) {
      alert("Xəta: " + err.message);
    }
  };

  
  const deleteChat = async () => {
    try {
      if (!activeChat) return;
      const deletedChats = JSON.parse(localStorage.getItem('deleted_chats_time') || '{}');
      deletedChats[activeChat] = new Date().toISOString();
      localStorage.setItem('deleted_chats_time', JSON.stringify(deletedChats));
      
      setMessages([]);
      setChats(prev => prev.filter(c => c.otherUser.id !== activeChat));
      setActiveChat(null);
      setShowDeleteModal(false);
    } catch(err) {
      alert("Silinmədi: Xəta baş verdi");
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateAz = (isoString: string) => {
    const date = new Date(isoString);
    const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  if (!isUserLoaded || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!user) return null;

  const currentChatDetails = chats.find(c => c.otherUser.id === activeChat)?.otherUser;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden flex h-[75vh] min-h-[600px] max-h-[850px]">
        
        {/* Sidebar */}
        <div className={`w-full md:w-[350px] bg-white border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-2xl font-black text-black">Mesajlar</h1>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-gray-400 mt-10">
                <MessageCircle className="w-14 h-14 mx-auto mb-3 opacity-20" />
                <p className="font-bold">Hələ heç bir mesajınız yoxdur.</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.otherUser.id}
                  onClick={() => setActiveChat(chat.otherUser.id)}
                  className={`w-full p-4 flex items-center gap-4 border-b border-gray-50 transition-all hover:bg-gray-50 ${activeChat === chat.otherUser.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                      {chat.otherUser?.avatar ? (
                        <img src={chat.otherUser.avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 truncate text-[15px]">{chat.otherUser?.name || chat.otherUser?.phone || 'Naməlum İstifadəçi'}</h3>
                      <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
                        {formatTime(chat.lastMessage.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {chat.lastMessage.sender_id === user.id && (
                        chat.lastMessage.is_read ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <Check className="w-4 h-4 text-gray-400" />
                      )}
                      <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-black font-bold' : 'text-gray-500 font-medium'}`}>
                        {chat.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex-col bg-[#f0f2f5] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-bold text-xl text-gray-500">Bir söhbət seçin</p>
              <p className="text-sm font-medium mt-1">və ya yeni mesaja başlayın</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-4 shadow-sm z-10">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 relative">
                  {currentChatDetails?.avatar ? (
                    <Image src={currentChatDetails.avatar} fill sizes="44px" priority className="object-cover" alt="" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/istifadeci/${activeChat}`} className="font-bold text-gray-900 text-lg leading-tight hover:text-blue-600 transition-colors inline-block">{currentChatDetails?.name || currentChatDetails?.phone || 'İstifadəçi'}</Link>
                </div>
                <button onClick={() => setShowDeleteModal(true)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Söhbəti sil">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div ref={messagesContainerRef} className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 relative">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === user.id;
                  const showDate = idx === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[idx-1].created_at).toDateString();
                  
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="bg-white/80 backdrop-blur text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                            {formatDateAz(msg.created_at)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                            isMe 
                              ? 'bg-blue-600 text-white rounded-br-sm' 
                              : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                          }`}>
                            {msg.content}
                            <div className={`flex items-center justify-end gap-1 mt-1 -mb-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                              <span className="text-[10.5px] font-medium">{formatTime(msg.created_at)}</span>
                              {isMe && (
                                msg.is_read 
                                  ? <span title={`Oxundu: ${msg.read_at ? formatTime(msg.read_at) : ''}`}><CheckCheck className="w-3.5 h-3.5 text-blue-200" /></span> 
                                  : <Check className="w-3.5 h-3.5 opacity-70" />
                              )}
                            </div>
                          </div>
                          
                          {/* Read receipt timestamp popover (only shown on hover using CSS group if we want, but for now simple title attribute is used on the checkmark) */}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesaj yazın..."
                  className="flex-1 px-5 py-3.5 bg-gray-100 hover:bg-gray-200/50 focus:bg-white rounded-full outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500 transition-all text-gray-800 font-medium placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-2">Söhbəti sil</h3>
            <p className="text-gray-500 font-medium mb-6">Bu söhbəti tamamilə silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Ləğv et</button>
              <button onClick={deleteChat} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-500/20">Sil</button>
            </div>
          </div>
        </div>
      )}
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
