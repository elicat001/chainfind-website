import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Wifi, Cpu, Shield } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToChainCore } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

const TerminalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { 
      id: 'init', 
      role: MessageRole.SYSTEM, 
      text: 'CHAIN_CORE v2.5.0 online.\nConnected to secure node.\nType a command or query to begin interaction.' 
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

    // Create a placeholder for the AI response
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

      // Finalize
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
    <div className="w-full max-w-4xl mx-auto my-12 font-mono border border-green-500/50 bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.15)] z-10 relative">
      {/* Terminal Header */}
      <div className="bg-green-900/20 border-b border-green-500/30 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-green-400 text-xs flex items-center gap-2">
          <Wifi size={12} className="animate-pulse" />
          user@chainfind:~
        </div>
      </div>

      {/* Terminal Body */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4 text-sm" id="terminal-body">
        {history.map((msg) => (
          <div key={msg.id} className={`${msg.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[90%] p-2 rounded ${
              msg.role === MessageRole.USER 
                ? 'bg-green-900/30 text-green-100 border border-green-500/30' 
                : msg.role === MessageRole.SYSTEM
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}>
              <span className="font-bold text-xs block opacity-50 mb-1">
                {msg.role === MessageRole.USER ? '> YOU' : '> CHAIN_CORE'}
              </span>
              <pre className="whitespace-pre-wrap font-mono">{msg.text}</pre>
              {msg.isTyping && <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-blink align-middle"></span>}
            </div>
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
          placeholder="Enter system command or query..."
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