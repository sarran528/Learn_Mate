import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Add a welcome message from the bot on initial render
    setMessages([
      {
        text: "Hello! I'm Learn_mate. What would you like to learn today?",
        isUser: false,
      },
    ]);
  }, []);

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse: Message = { text: data.message, isUser: false };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${errorMessage}. Please check the backend connection.`, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-white/70 backdrop-blur-sm border border-blue-100 rounded-xl shadow-lg">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start space-x-3 max-w-4xl ${msg.isUser ? 'justify-end' : ''}`}>
              {!msg.isUser && (
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white flex-shrink-0">
                  <Bot size={20} />
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl prose prose-sm max-w-full ${msg.isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
              {msg.isUser && (
                <div className="p-2 bg-gray-200 rounded-full text-gray-700 flex-shrink-0">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white flex-shrink-0">
                  <Bot size={20} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                   <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-blue-100">
         {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isLoading ? "Waiting for response..." : "Ask me anything to start your learning journey..."}
            className="w-full pl-4 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-all duration-200"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '50px', maxHeight: '150px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> : <Send size={20} />}
          </button>
        </div>
         <p className="text-xs text-gray-500 mt-2 text-center">
            Press <kbd className="px-1.5 py-0.5 border border-gray-300 rounded text-gray-600"><CornerDownLeft size={10} className="inline-block"/></kbd> for new line.
          </p>
      </div>
    </div>
  );
};

export default ChatInterface;
