import React, { useState, useRef, useEffect } from 'react';
import { Send, Wifi, Mail, Key, Globe, CheckCircle } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToChainCore } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";
import { CyberButton } from './HackerUI';

const TerminalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { 
      id: 'init', 
      role: MessageRole.SYSTEM, 
      text: 'CHAIN_CORE v2.5.0 online.\nType /help to view available commands.\nType /signal to open secure transmission line.' 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const successMsg: ChatMessage = {
          id: Date.now().toString(),
          role: MessageRole.SYSTEM,
          text: 'TRANSMISSION_COMPLETE: Signal encrypted and sent to base. Stand by for response.'
      };
      setHistory(prev => [...prev, successMsg]);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input
    };

    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    const command = userMsg.text.trim().toLowerCase();

    // --- COMMAND INTERCEPTION ---
    if (command === '/help') {
        setHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: MessageRole.SYSTEM,
            text: `AVAILABLE COMMANDS:\n\n/help    - Show this list\n/signal  - Open encrypted contact form\n/clear   - Clear terminal history\n/status  - Check system integrity`
        }]);
        setIsProcessing(false);
        return;
    }

    if (command === '/clear') {
        setHistory([{ 
            id: Date.now().toString(), 
            role: MessageRole.SYSTEM, 
            text: 'TERMINAL CLEARED.' 
        }]);
        setIsProcessing(false);
        return;
    }

    if (command === '/signal' || command === '/contact') {
        // Insert the Contact Form as a specific message type or just render it via a custom text marker
        setHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: MessageRole.SYSTEM,
            text: 'OPENING SECURE CHANNEL...',
            isCustomUI: true // Custom flag we will handle in render
        }]);
        setIsProcessing(false);
        return;
    }
    // ---------------------------

    // Default: Send to AI
    const responseId = (Date.now() + 1).toString();
    setHistory(prev => [...prev, { id: responseId, role: MessageRole.AI, text: '', isTyping: true }]);

    try {
      const stream = await sendMessageToChainCore(userMsg.text);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setHistory(prev => 
            prev.map(msg => 
              msg.id === responseId 
                ? { ...msg, text: fullText, isTyping: true } 
                : msg
            )
          );
        }
      }

      setHistory(prev => 
        prev.map(msg => 
          msg.id === responseId 
            ? { ...msg, isTyping: false } 
            : msg
        )
      );

    } catch (error) {
      setHistory(prev => [...prev, { 
        id: Date.now().toString(), 
        role: MessageRole.SYSTEM, 
        text: 'ERROR: Connection to mainframe interrupted. Firewall active.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 font-mono border border-green-500/50 bg-black/90 backdrop-blur-md rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.15)] z-10 relative">
      {/* Terminal Header */}
      <div className="bg-green-900/20 border-b border-green-500/30 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-green-400 text-xs flex items-center gap-2">
          <Wifi size={12} className="animate-pulse" />
          root@chainfind:~/core
        </div>
      </div>

      {/* Terminal Body */}
      <div className="h-[500px] overflow-y-auto p-4 space-y-4 text-sm custom-scrollbar" id="terminal-body">
        {history.map((msg) => (
          <div key={msg.id} className={`${msg.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
            
            {msg.isCustomUI ? (
                // RENDER CONTACT FORM UI
                <div className="inline-block w-full max-w-2xl p-6 bg-green-900/10 border border-green-500/50 rounded relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-scanline"></div>
                    <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                        <Globe size={18} /> SECURE_TRANSMISSION_PROTOCOL
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                         <div className="space-y-4 text-xs">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail size={14} className="text-green-500"/>
                                <span>qin@chainfind.cn</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail size={14} className="text-green-500"/>
                                <span>qin@bazihui.asia</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Key size={14} className="text-green-500"/>
                                <span className="bg-black px-2 py-1 border border-green-900 text-green-600">MTg4MjY1NzQzMzE=</span>
                            </div>
                         </div>
                         <form onSubmit={handleContactSubmit} className="space-y-3">
                             <input className="w-full bg-black/50 border border-green-900 p-2 text-green-500 text-xs focus:border-green-500 outline-none" placeholder="IDENTITY_STRING" required />
                             <input className="w-full bg-black/50 border border-green-900 p-2 text-green-500 text-xs focus:border-green-500 outline-none" placeholder="RETURN_PATH (EMAIL)" required type="email" />
                             <textarea className="w-full bg-black/50 border border-green-900 p-2 text-green-500 text-xs focus:border-green-500 outline-none" placeholder="PAYLOAD_MESSAGE" rows={2} required></textarea>
                             <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-black font-bold text-xs py-2 flex items-center justify-center gap-2">
                                 <Send size={12} /> EXECUTE
                             </button>
                         </form>
                    </div>
                </div>
            ) : (
                // RENDER STANDARD TEXT
                <div className={`inline-block max-w-[90%] p-2 rounded ${
                msg.role === MessageRole.USER 
                    ? 'bg-green-900/30 text-green-100 border border-green-500/30' 
                    : msg.role === MessageRole.SYSTEM
                    ? 'text-yellow-400 w-full'
                    : 'text-green-400'
                }`}>
                <span className="font-bold text-xs block opacity-50 mb-1">
                    {msg.role === MessageRole.USER ? '> YOU' : '> CHAIN_CORE'}
                </span>
                <pre className="whitespace-pre-wrap font-mono">{msg.text}</pre>
                {msg.isTyping && <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-blink align-middle"></span>}
                </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleCommand} className="border-t border-green-500/30 p-2 bg-black/50 flex items-center gap-2">
        <span className="text-green-500 font-bold pl-2">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command (/signal, /help) or query..."
          className="flex-1 bg-transparent border-none outline-none text-green-300 font-mono placeholder-green-800 focus:ring-0"
          autoFocus
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          disabled={isProcessing}
          className="p-2 text-green-500 hover:text-green-300 hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default TerminalChat;