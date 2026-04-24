import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, User } from 'lucide-react';
import { messageService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import clsx from 'clsx';

interface ChatBoxProps {
  receiverId: string;
  receiverName: string;
  onClose?: () => void;
}

export function ChatBox({ receiverId, receiverName, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !receiverId) return;

    setLoading(true);
    messageService.getChat(user.id, receiverId).then(data => {
      setMessages(data);
      setLoading(false);
    });

    // Subscribe to real-time messages
    const channel = supabase
      .channel(`chat:${user.id}:${receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        payload => {
          if (payload.new.sender_id === receiverId) {
            setMessages(prev => [...prev, {
              id: payload.new.id,
              senderId: payload.new.sender_id,
              receiverId: payload.new.receiver_id,
              message: payload.new.message,
              timestamp: payload.new.created_at,
              isRead: payload.new.is_read
            }]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, receiverId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      const sent = await messageService.sendMessage(user.id, receiverId, newMessage);
      setMessages(prev => [...prev, sent]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm">{receiverName}</p>
            <p className="text-[10px] text-blue-100 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-12 w-12 text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 italic">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              className={clsx(
                "flex flex-col max-w-[80%]",
                msg.senderId === user.id ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={clsx(
                  "px-3 py-2 rounded-2xl text-sm shadow-sm",
                  msg.senderId === user.id
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-600"
                )}
              >
                {msg.message}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="h-10 w-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
