import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, Send, X, Bot, User, Mic, MicOff, 
  Minimize2, ChevronDown 
} from 'lucide-react';

const AIChat = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your smart real estate assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // API configuration
  const API_KEY = 'AIzaSyCxcYVwbavYt3Ker_zz0zeKZ6p5p7X50es';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Fetch AI response from Gemini
  const fetchAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful real estate assistant. Please respond to this message in a friendly and professional manner: "${userMessage}"`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates?.[0]?.content) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return 'Sorry, I couldn\'t process your request. Please try again later.';
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'There was an error connecting to the AI assistant. Please try again.';
    } finally {
      setIsTyping(false);
    }
  };

  // Simulate typing effect
  const simulateTypingEffect = async (response: string, callback: (text: string) => void) => {
    setIsTyping(true);
    const words = response.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + ' ';
      callback(currentText);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
    }
    
    setIsTyping(false);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    const aiResponse = await fetchAIResponse(inputValue);
    
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botResponse]);
    
    simulateTypingEffect(aiResponse, (text) => {
      setMessages(prev => prev.map(msg => 
        msg.id === botResponse.id ? {...msg, content: text} : msg
      ));
    });
  };

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle voice recognition
  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  // Toggle minimize chat
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // Close chat
  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Message component
  const Message = ({ message }: { message: any }) => (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          message.type === 'user'
            ? 'bg-[#DCF8C6] text-gray-800 rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 ${isMinimized ? 'h-14' : 'h-[500px]'} flex flex-col bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 transition-all duration-300`}>
          {/* Chat Header */}
          <div className="bg-[#075E54] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Real Estate AI</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-xs text-gray-200">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMinimize}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                {isMinimized ? <ChevronDown className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={closeChat}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area - Only show when not minimized */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5] bg-opacity-30">
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#F0F0F0] border-t border-gray-200">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 pr-12 rounded-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none text-sm bg-white"
                    />
                    <button
                      onClick={toggleVoice}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full ${
                        isListening 
                          ? 'bg-red-100 text-red-600' 
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`h-10 w-10 flex items-center justify-center rounded-full ${
                      inputValue.trim() 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-300 text-gray-500'
                    } transition-all`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChat;