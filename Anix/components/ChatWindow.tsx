
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import type { ChatContact, ChatMessage } from '../types';
import { generateChatHistory } from '../services/geminiService';

interface ChatWindowProps {
  contact: ChatContact;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8 h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
);

type AttachmentPreview = {
  url: string;
  name: string;
  type: 'image' | 'file';
  size: string;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ contact }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState<AttachmentPreview | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await generateChatHistory(contact.user);
        setMessages(history);
      } catch (err) {
        setError('Failed to load chat history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [contact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
      if (newMessage.trim() || attachmentPreview) {
          const msg: ChatMessage = {
              id: new Date().toISOString(),
              text: newMessage,
              sender: 'me',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              imageUrl: attachmentPreview?.type === 'image' ? attachmentPreview.url : undefined,
              file: attachmentPreview?.type === 'file' ? { name: attachmentPreview.name, url: attachmentPreview.url, size: attachmentPreview.size } : undefined,
          };
          setMessages(prev => [...prev, msg]);
          setNewMessage('');
          setAttachmentPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview({
          url: reader.result as string,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
      setAttachmentPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {loading && <LoadingSpinner />}
        {error && <p className="text-center text-red-500 my-4">{error}</p>}
        {!loading && !error && messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md rounded-2xl p-3 ${msg.sender === 'me' ? 'bg-primary text-white rounded-br-none' : 'bg-card_bg text-text_primary rounded-bl-none border border-border'}`}>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="attached" className="rounded-xl mb-2 max-w-full h-auto object-cover border border-black/10"/>
              )}
              {msg.file && (
                <div className={`flex items-center space-x-3 p-2 rounded-lg mb-2 ${msg.sender === 'me' ? 'bg-white/20' : 'bg-border'}`}>
                  <Icon name="file-text" className="w-6 h-6" />
                  <div className="flex-1 truncate">
                    <p className="text-sm font-semibold truncate">{msg.file.name}</p>
                    <p className="text-xs opacity-70">{msg.file.size}</p>
                  </div>
                </div>
              )}
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right opacity-70`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Area */}
      {attachmentPreview && (
          <div className="px-4 py-2 border-t border-border bg-background">
              <div className="relative inline-block">
                  {attachmentPreview.type === 'image' ? (
                      <img src={attachmentPreview.url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-border" />
                  ) : (
                      <div className="w-20 h-20 bg-card_bg border border-border rounded-lg flex flex-col items-center justify-center p-2">
                          <Icon name="file-text" className="w-8 h-8 text-primary" />
                          <p className="text-[10px] truncate w-full text-center mt-1">{attachmentPreview.name}</p>
                      </div>
                  )}
                  <button 
                      onClick={removeAttachment}
                      className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                  >
                      <Icon name="close" className="w-3 h-3" />
                  </button>
              </div>
          </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-end space-x-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
            aria-label="Attach file"
          >
            <Icon name="paperclip" className="w-6 h-6" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-card_bg text-text_primary px-4 py-2 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none max-h-32"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() && !attachmentPreview}
            className={`p-3 rounded-full transition-colors ${newMessage.trim() || attachmentPreview ? 'bg-primary text-white hover:bg-primary_hover' : 'bg-gray-400 text-white cursor-not-allowed'}`}
            aria-label="Send message"
          >
            <Icon name="send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
