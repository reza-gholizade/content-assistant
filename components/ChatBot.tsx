
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { Language, TranslationStrings, ThemeColor } from '../types';
import { askAdvisor } from '../services/gemini';

interface Props {
  lang: Language;
  t: TranslationStrings;
  themeColor: ThemeColor;
}

export const ChatBot: React.FC<Props> = ({ lang, t, themeColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const primaryClass = {
    blue: 'bg-blue-500 shadow-blue-500/20',
    rose: 'bg-rose-500 shadow-rose-500/20',
    emerald: 'bg-emerald-500 shadow-emerald-500/20'
  }[themeColor];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    try {
      const response = await askAdvisor(userMsg, lang);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to AI' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-8 ${lang === 'fa' ? 'left-8' : 'right-8'} z-50`}>
      {isOpen ? (
        <div className="w-80 sm:w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          <div className={`p-6 ${primaryClass} text-white flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={24} />
              </div>
              <span className="font-black text-lg">{t.chatTitle}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/50 dark:bg-gray-950/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-600 mt-20 flex flex-col items-center">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <Bot className="opacity-40" size={40} />
                </div>
                <p className="text-sm font-bold max-w-[200px] leading-relaxed">{t.chatPlaceholder}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-3xl flex gap-2 text-base leading-relaxed font-bold ${
                  m.role === 'user' 
                    ? `${primaryClass} text-white rounded-tr-none shadow-lg` 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm'
                }`}>
                  <div className="flex-1">{m.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.chatPlaceholder}
                className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3 text-base font-bold focus:outline-none focus:ring-4 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`${primaryClass} text-white p-4 rounded-2xl hover:brightness-110 transition-all disabled:opacity-30 shadow-lg`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-16 h-16 ${primaryClass} text-white rounded-[1.75rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <MessageSquare size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        </button>
      )}
    </div>
  );
};
