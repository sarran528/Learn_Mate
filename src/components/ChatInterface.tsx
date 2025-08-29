import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CornerDownLeft, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  token: string;
  setChecklist: (checklist: string[]) => void;
  setRoadmap: (roadmap: string[]) => void;
  darkMode: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ token, setChecklist, setRoadmap, darkMode }) => {
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
        text: "Hello! I'm Learn_mate, your AI-powered learning companion. 🚀\n\nI can help you:\n• Create personalized learning roadmaps\n• Build interactive checklists\n• Answer questions about any topic\n• Guide you through complex concepts\n\nWhat would you like to learn today?",
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse: Message = { text: data.message, isUser: false };
      setMessages((prev) => [...prev, aiResponse]);

      // Update UI panels with the new data
      if (data.checklist) {
        setChecklist(data.checklist);
      }
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      }

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
            <Bot className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              AI Learning Assistant
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ask me anything about learning!
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
        <div className="flex flex-col space-y-6">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-4 animate-in slide-in-from-bottom-2 duration-300 ${
                msg.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!msg.isUser && (
                <div className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/25' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25'
                }`}>
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                msg.isUser 
                  ? `${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'} rounded-br-md` 
                  : `${darkMode ? 'bg-slate-800 text-gray-100 border border-slate-700' : 'bg-white text-gray-800 border border-gray-200'} rounded-bl-md`
              }`}>
                <div className={`prose prose-sm max-w-none ${
                  darkMode ? 'prose-invert' : ''
                }`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      code: ({ children }) => (
                        <code className={`px-2 py-1 rounded text-xs font-mono ${
                          darkMode ? 'bg-slate-700 text-blue-300' : 'bg-gray-100 text-blue-600'
                        }`}>
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className={`p-3 rounded-lg text-xs font-mono overflow-x-auto ${
                          darkMode ? 'bg-slate-700 text-gray-100' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
              
              {msg.isUser && (
                <div className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <User className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${
                darkMode 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/25' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25'
              }`}>
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className={`px-6 py-4 rounded-2xl shadow-lg ${
                darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              } rounded-bl-md`}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`p-6 border-t ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
        {error && (
          <div className={`mb-4 p-3 rounded-xl text-sm text-center ${
            darkMode ? 'bg-red-900/50 text-red-300 border border-red-700' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {error}
          </div>
        )}
        
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
            className={`w-full pl-4 pr-16 py-4 rounded-2xl border-2 transition-all duration-300 resize-none focus:outline-none focus:ring-4 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '60px', maxHeight: '200px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 ${
              isLoading || !input.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-110 active:scale-95'
            } ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Press <kbd className={`px-2 py-1 rounded text-xs font-mono ${
              darkMode ? 'bg-slate-700 border border-slate-600' : 'bg-gray-100 border border-gray-300'
            }`}>
              <CornerDownLeft className="inline-block h-3 w-3" />
            </kbd> for new line
          </p>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Powered by AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
