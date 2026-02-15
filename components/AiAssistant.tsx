
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

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
      // Use a guard to ensure process is available
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'assistant', text: "AI Assistant is currently unavailable (API key missing)." }]);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const catalogInfo = products.map(p => 
        `ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price}, Difficulty: ${p.difficulty || 'N/A'}, Category: ${p.category || 'Livestock'}, Description: ${p.description}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are the Mvs_Aqua shopping assistant. Your goal is to help customers find the best aquatic products for their needs.
          The current catalog is:\n${catalogInfo}\n
          Rules:
          1. Be friendly and helpful.
          2. Recommend products based on user needs (tank size, difficulty, budget).
          3. If the user wants to buy something, mention the exact product name from the catalog.
          4. If the user asks for help picking, suggest 1-3 items.
          5. Keep responses concise and focused on the aquatic hobby.`,
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 md:w-96 flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-deepSea p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles size={20} className="text-coralPop" />
              Aqua Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="font-medium text-sm">Hello! How can I help you find the perfect fish today?</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["Beginner fish?", "Best for small tanks?", "Discus care?"].map(hint => (
                    <button 
                      key={hint} 
                      onClick={() => setInput(hint)}
                      className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full hover:border-deepSea transition"
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
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                  <Loader2 size={16} className="animate-spin text-deepSea" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about fish..."
              className="flex-grow px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-deepSea/20"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-deepSea text-white p-2 rounded-xl hover:bg-[#003d61] transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-deepSea text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        >
          <MessageSquare className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};
