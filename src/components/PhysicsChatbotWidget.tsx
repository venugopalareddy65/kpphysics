import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Atom,
  Sparkles,
  Trash2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface PhysicsChatbotWidgetProps {
  studentName?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    text: 'Hi Venu! I am your KP Physics AI Doubt-Solver. Ask me any Physics derivation, formula, numerical problem, or JEE/NEET preparation question!',
    timestamp: 'Just now'
  }
];

const QUICK_PROMPTS = [
  'Explain Lorentz Force F = q(v × B)',
  'Gauss Law for infinite line charge',
  'Projectile max height & range formula',
  'How to score 95%+ in Class 12 Physics?'
];

export const PhysicsChatbotWidget: React.FC<PhysicsChatbotWidgetProps> = ({
  studentName = 'Venu'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          studentName,
          history: updatedHistory.map((m) => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from Physics AI.');
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text:
          err?.message ||
          'Sorry, I encountered a connection issue while solving that Physics query. Please try again!',
        timestamp: 'Now'
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 select-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-[calc(100vw-2rem)] sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(2,6,23,0.45)] overflow-hidden flex flex-col"
          >
            {/* Top Gradient Header */}
            <div className="bg-gradient-to-r from-[#050C24] via-[#0B1942] to-[#112559] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-md shrink-0">
                  <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                      AI PHYSICS DOUBT TUTOR
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    KP Physics Assistant
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Minimize chat"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendQuestion(q)}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[10px] font-semibold text-slate-700 hover:text-blue-700 whitespace-nowrap transition-all shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages Scroll Container */}
            <div className="p-4 h-80 overflow-y-auto space-y-3 bg-[#F8FAFC] select-text">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 px-1">
                      {isUser ? studentName : 'KP Physics AI'} · {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Deriving Physics solution...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any Physics formula or doubt..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold shadow-xs hover:shadow-md disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="chat-launcher"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#061029] via-[#0E224D] to-[#1D4ED8] text-white border border-cyan-400/50 shadow-[0_10px_30px_rgba(37,99,235,0.45)] hover:shadow-[0_0_25px_rgba(56,189,248,0.65)] transition-all"
          >
            <div className="relative w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#061029]" />
            </div>
            <div className="text-left pr-1">
              <div className="text-[10px] font-mono text-amber-300 font-bold leading-none">
                24/7 AI TUTOR
              </div>
              <div className="text-xs font-bold text-white leading-tight">
                Ask Physics Doubt
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
