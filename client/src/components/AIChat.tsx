import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, X, ChevronDown, Mic, MicOff, 
  Menu, Phone, Video, Info, Search, 
  Paperclip, Smile, Camera, Bookmark, 
  ArrowLeft, Check, CheckCheck, MoreVertical
} from 'lucide-react';

const AIRealEstateApp = () => {
  // State management
  const [chatState, setChatState] = useState<'expanded' | 'minimized' | 'closed'>('closed');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً! أنا مساعدك الذكي للبحث عن العقارات. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      read: true
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
              text: `أنت مساعد عقاري ذكي في المملكة العربية السعودية، مهمتك مساعدة المستخدمين في البحث عن العقارات المناسبة، الإجابة على استفساراتهم، وتقديم نصائح متخصصة. تذكر أن تكون ودوداً، مفيداً، ومحترفاً. الرد على هذا السؤال: "${userMessage}"`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates?.[0]?.content) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return 'عذراً، لم أتمكن من معالجة طلبك. يمكنك إعادة المحاولة لاحقاً.';
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.';
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

  // Toggle chat state
  const toggleChatState = (state: 'expanded' | 'minimized' | 'closed') => {
    setChatState(state);
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
          onClick={() => toggleChatState('minimized')}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-white">المساعد العقاري الذكي</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/90">متصل الآن</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-white">
        <button className="opacity-70 hover:opacity-100">
          <Phone className="h-5 w-5" />
        </button>
        <button className="opacity-70 hover:opacity-100">
          <Video className="h-5 w-5" />
        </button>
        <button className="opacity-70 hover:opacity-100">
          <Search className="h-5 w-5" />
        </button>
        <button className="opacity-70 hover:opacity-100">
          <MoreVertical className="h-5 w-5" />
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
            {message.timestamp.toLocaleTimeString('ar-SA', { 
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
            placeholder="اكتب رسالتك..."
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
    <div className="font-sans">
      {/* Floating Button */}
      {chatState === 'closed' && (
        <button
          onClick={() => toggleChatState('expanded')}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-[#128C7E] shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping" />
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
          </div>
        </button>
      )}

      {/* Minimized Chat */}
      {chatState === 'minimized' && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#128C7E] shadow-xl flex items-center justify-center cursor-pointer"
          onClick={() => toggleChatState('expanded')}
        >
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
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
              مدعوم بـ Gemini AI - مساعد عقاري ذكي بذكاء اصطناعي متقدم
            </p>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto bg-[#ECE5DD] bg-opacity-50 p-2"
            onClick={markAsRead}
          >
            <div className="text-center my-4">
              <div className="inline-block bg-[#128C7E] bg-opacity-10 px-4 py-1 rounded-full">
                <p className="text-xs text-[#128C7E]">اليوم</p>
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

export default AIRealEstateApp;
