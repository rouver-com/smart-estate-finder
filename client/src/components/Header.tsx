import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, Sun, Moon, MessageCircle, Bot, Home, Info, Contact } from 'lucide-react';

const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleAIAssistant = () => {
    setAIAssistantOpen(!aiAssistantOpen);
  };

  useEffect(() => {
    // Apply saved preferences
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '/', icon: <Home size={18} /> },
    { label: 'Properties', href: '/properties', icon: <Building2 size={18} /> },
    { label: 'Blog', href: '/blog', icon: <MessageCircle size={18} /> },
    { label: 'About', href: '/about', icon: <Info size={18} /> },
    { label: 'Contact', href: '/contact', icon: <Contact size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      {/* AI Assistant Modal */}
      {aiAssistantOpen && (
        <AIChatWidget onClose={toggleAIAssistant} />
      )}

      <header className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 transition-all duration-300 ${
        scrolled 
          ? 'shadow-md py-2 border-b border-gray-200 dark:border-gray-800' 
          : 'py-3'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="bg-white w-6 h-6 md:w-7 md:h-7 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm"></div>
                </div>
              </div>
              <div className="ml-2">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Inspire</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Smart Real Estate</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium group"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-full mt-1" />
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <button 
                onClick={toggleAIAssistant}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:shadow-md transition-all"
              >
                <Bot size={18} />
                <span>AI Assistant</span>
              </button>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - MODIFIED FOR VERTICAL STACKING */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <div className="text-blue-500">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>

              {/* AI Assistant Button */}
              <button 
                onClick={toggleAIAssistant}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <div className="text-blue-500">
                  <Bot size={18} />
                </div>
                <span className="font-medium">AI Assistant</span>
              </button>

              {/* Mobile Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <div className="text-blue-500">
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <span className="font-medium">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="pt-24 container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Responsive Website Header
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Modern header with mobile-responsive design featuring a fully functional AI assistant and dark mode support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">AI Assistant</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The AI Assistant button is now fully functional. Click it to access smart property recommendations and answers to your questions.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm">AI Chat</span>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">Smart Help</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-indigo-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Mobile Responsive</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Menu items stack vertically on mobile devices with a clean modern design that works perfectly on all screen sizes.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">Mobile First</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-sm">Vertical Menu</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Design Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Functional AI Assistant</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Light/Dark Mode</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Fully Responsive Design</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Vertical Mobile Menu</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Modern Visual Effects</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Clean UI Components</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Chat Widget Component (Remains the same)
const AIChatWidget = ({ onClose }: { onClose: () => void }) => {
  const [chatState, setChatState] = useState<'expanded' | 'minimized'>('expanded');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I am your smart real estate assistant. How can I help you today?',
      timestamp: new Date(),
      read: true
    }
  ]);
  
  // Refs
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // API configuration
  const API_KEY = 'AIzaSyCxcYVwbavYt3Ker_zz0zeKZ6p5p7X50es';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  // Scroll to bottom of messages
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Fetch AI response
  const fetchAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a smart real estate assistant in Saudi Arabia. Your task is to help users find suitable properties, answer their inquiries, and provide expert advice. Remember to be friendly, helpful, and professional. Respond to this question: "${userMessage}"`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates?.[0]?.content) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return 'Sorry, I could not process your request. Please try again later.';
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'An error occurred while connecting to the AI assistant. Please try again.';
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
      read: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    const aiResponse = await fetchAIResponse(inputValue);
    
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      read: false
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
    // In a real app, this would start/stop voice recognition
  };

  // Mark messages as read
  const markAsRead = () => {
    setMessages(prev => prev.map(msg => ({...msg, read: true})));
  };

  // Chat header component
  const ChatHeader = () => (
    <div className="bg-[#128C7E] p-3 flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setChatState('minimized')}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">Smart Real Estate Assistant</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/90">Online now</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-white">
        <button 
          onClick={onClose}
          className="opacity-70 hover:opacity-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  // Message component
  const Message = ({ message }: { message: any }) => (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.type === 'user'
            ? 'bg-[#DCF8C6] text-gray-800 rounded-tr-none'
            : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div className="flex justify-end items-center mt-1">
          <span className="text-[10px] text-gray-500">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.type === 'user' && (
            <span className="ml-1">
              {message.read ? (
                <CheckCheck className="h-3 w-3 text-blue-500" />
              ) : (
                <Check className="h-3 w-3 text-gray-400" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Input area component
  const InputArea = () => (
    <div className="p-3 bg-[#F0F0F0]">
      <div className="flex gap-2 items-center">
        <button className="text-gray-500 hover:text-gray-700">
          <Paperclip className="h-5 w-5 transform rotate-45" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Camera className="h-5 w-5" />
        </button>
        
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none text-sm bg-white"
          />
          <button
            onClick={toggleVoice}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isListening ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Smile size={18} />
          </button>
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className={`h-10 w-10 flex items-center justify-center rounded-full ${
            inputValue.trim() 
              ? 'bg-[#128C7E] text-white' 
              : 'bg-gray-300 text-gray-400'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Minimized Chat */}
      {chatState === 'minimized' && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#128C7E] shadow-xl flex items-center justify-center cursor-pointer"
          onClick={() => setChatState('expanded')}
        >
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
            <Bot className="h-8 w-8 text-white" />
          </div>
        </div>
      )}

      {/* Expanded Chat */}
      {chatState === 'expanded' && (
        <div className="fixed bottom-6 right-6 z-50 h-[500px] w-[350px] flex flex-col bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 transition-all duration-300">
          <ChatHeader />
          
          {/* Chat Info */}
          <div className="p-3 bg-[#F0F0F0] text-center border-b border-gray-200">
            <p className="text-xs text-gray-600">
              Powered by Gemini AI - Advanced AI real estate assistant
            </p>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto bg-[#ECE5DD] bg-opacity-50 p-2"
            onClick={markAsRead}
          >
            <div className="text-center my-4">
              <div className="inline-block bg-[#128C7E] bg-opacity-10 px-4 py-1 rounded-full">
                <p className="text-xs text-[#128C7E]">Today</p>
              </div>
            </div>
            
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-2 px-4">
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <InputArea />
        </div>
      )}
    </div>
  );
};

// Icons needed for the chat widget
const ArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Paperclip = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const Camera = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Mic = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const MicOff = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2 2m4-4l-2-2m-3.268 3.268A6.001 6.001 0 016 9v0" />
  </svg>
);

const Smile = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01M15 9h.01" />
  </svg>
);

const Send = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CheckCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" transform="translate(0 5)" />
  </svg>
);

export default Header;
