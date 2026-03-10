
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { GoogleGenAI } from "@google/genai";

interface AiAssistantModalProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Bonjour ! Je suis l\'Assistant IA de Xelar. Comment puis-je vous aider dans vos recherches ou vos études aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
            systemInstruction: "Tu es l'assistant IA de Xelar, un réseau social académique. Sois poli, concis et utile pour les étudiants et professeurs. Réponds en français.",
        }
      });

      const aiMsg: Message = { role: 'ai', text: response.text || "Désolé, je n'ai pas pu générer de réponse." };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Une erreur est survenue lors de la connexion à l'IA." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Assistant IA Meta">
      <div className="h-[75vh] flex flex-col bg-background">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-card_bg border border-border text-text_primary rounded-bl-none'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center space-x-2 mb-1 opacity-70">
                    <Icon name="meta-ai" className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Meta AI</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-card_bg border border-border p-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-text_secondary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-text_secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-text_secondary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
               </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 border-t border-border bg-card_bg/50">
          <div className="flex items-center space-x-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Demandez n'importe quoi à l'IA..."
              className="flex-1 bg-background border border-border px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary_hover transition-colors disabled:opacity-50"
            >
              <Icon name="send" className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-text_secondary mt-2">
            Propulsé par Gemini 3 Flash • L'IA peut faire des erreurs.
          </p>
        </div>
      </div>
    </Modal>
  );
};
