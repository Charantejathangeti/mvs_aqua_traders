
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface AiAssistantProps {
  products: Product[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // The API key is injected via process.env.API_KEY by the environment
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm unable to connect right now (API Key not configured)." }]);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const catalogInfo = products.map(p => 
        `ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price}, Category: ${p.category || 'Livestock'}, Description: ${p.description}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are the Mvs_Aqua shopping assistant. Your goal is to help customers find the best aquatic products.
          The current catalog is:\n${catalogInfo}\n
          Rules:
          1. Be friendly and professional.
          2. Recommend products based on user needs.
          3. If the user wants to buy something, mention the exact product name from the catalog.
          4. Suggest 1-3 items maximum.
          5. Keep responses concise.`,
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having a bit of trouble thinking right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 md:w-96 flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-deepSea p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles size={20} className="text-coralPop" />
              Aqua Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="font-medium text-sm">Hello! Looking for something specific for your aquarium?</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["Beginner fish?", "Best for small tanks?", "Tell me about Discus"].map(hint => (
                    <button 
                      key={hint} 
                      onClick={() => setInput(hint)}
                      className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-deepSea hover:text-deepSea transition-all shadow-sm"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-deepSea text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-deepSea" />
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-deepSea/10 focus:border-deepSea transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-deepSea text-white p-2.5 rounded-xl hover:bg-[#003d61] transition-all disabled:opacity-50 shadow-md active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-deepSea text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group relative"
        >
          <MessageSquare className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-coralPop rounded-full border-2 border-pristineWater animate-pulse"></span>
        </button>
      )}
    </div>
  );
};
