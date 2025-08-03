import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Search, Home, Building, MapPin, DollarSign, ChevronDown, ChevronUp, Sparkles, Settings, Bookmark, HelpCircle } from 'lucide-react';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً! أنا مساعدك الذكي للبحث عن العقارات. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: ['أبحث عن شقة للإيجار', 'فيلات للبيع في الرياض', 'مكاتب تجارية', 'عقارات بسعر محدد']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const API_KEY = 'AIzaSyCxcYVwbavYt3Ker_zz0zeKZ6p5p7X50es';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const fetchAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت مساعد عقاري ذكي في المملكة العربية السعودية، مهمتك مساعدة المستخدمين في البحث عن العقارات المناسبة، الإجابة على استفساراتهم، وتقديم نصائح متخصصة. تذكر أن تكون ودوداً، مفيداً، ومحترفاً. الرد على هذا السؤال: "${userMessage}"`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      suggestions: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    const aiResponse = await fetchAIResponse(inputValue);
    
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      suggestions: getSuggestions(inputValue)
    };
    
    setMessages(prev => [...prev, botResponse]);
    
    simulateTypingEffect(aiResponse, (text) => {
      setMessages(prev => prev.map(msg => 
        msg.id === botResponse.id ? {...msg, content: text} : msg
      ));
    });
  };

  const getSuggestions = (userMessage: string): string[] => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('شقة') || lowerMessage.includes('شقق')) {
      return ['شقق للإيجار في الرياض', 'شقق للبيع بجدة', 'شقق فندقية', 'شقق بمساحات صغيرة'];
    } else if (lowerMessage.includes('فيلا') || lowerMessage.includes('فلل')) {
      return ['فلل للبيع في الرياض', 'فلل للإيجار الشهري', 'فلل مع مسبح', 'فلل عائلية كبيرة'];
    } else if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة')) {
      return ['عقارات تحت مليون', 'عقارات بين 500-800 ألف', 'عقارات فاخرة', 'عقارات اقتصادية'];
    } else if (lowerMessage.includes('موقع') || lowerMessage.includes('منطقة')) {
      return ['عقارات في حي السفارات', 'عقارات قرب الجامعات', 'عقارات في شمال الرياض', 'عقارات على الكورنيش'];
    } else {
      return ['شقق للإيجار', 'فلل للبيع', 'مكاتب تجارية', 'أراضي للبيع'];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop voice recognition
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSaveProperty = () => {
    // Logic to save property
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: 'تم حفظ العقار في مفضلتك بنجاح! يمكنك الوصول إليه في أي وقت من قسم "المفضلة".',
      timestamp: new Date(),
      suggestions: []
    };
    setMessages(prev => [...prev, botResponse]);
  };

  return (
    <div className="font-sans">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isExpanded ? 'top-4 bottom-4 right-4 left-4 md:left-auto md:w-[600px]' : 'bottom-6 right-6'} z-50 ${isExpanded ? 'h-[calc(100vh-2rem)]' : 'h-[500px]'} w-[95vw] max-w-md md:w-[450px] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">المساعد العقاري الذكي</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/90">متصل الآن</span>
                  <Sparkles className="h-3 w-3 ml-1 text-yellow-300" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSettings}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              <button
                onClick={toggleExpand}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {isSettingsOpen && (
            <div className="bg-indigo-50 p-4 border-b border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-indigo-800">إعدادات المساعد</h4>
                <button 
                  onClick={toggleSettings}
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-100 p-1 rounded">
                      <Bot className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-indigo-700">نمط الردود</span>
                  </div>
                  <select className="w-full text-sm p-1.5 rounded border border-indigo-200 bg-white">
                    <option>احترافي (افتراضي)</option>
                    <option>ودود</option>
                    <option>مختصر</option>
                    <option>مفصّل</option>
                  </select>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-100 p-1 rounded">
                      <Mic className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-indigo-700">المساعدة الصوتية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <span className="text-sm text-gray-600">تفعيل</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.type === 'bot' && (
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-1.5">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {message.type === 'user' && (
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full p-1.5">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.type === 'bot' && (
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-100" />
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {message.type === 'bot' && message.content.includes('عقار') && (
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={handleSaveProperty}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                      >
                        <Bookmark className="h-3 w-3" />
                        حفظ العقار
                      </button>
                      <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                        <HelpCircle className="h-3 w-3" />
                        المزيد من التفاصيل
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 rounded-bl-none shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-1.5">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Search */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {[
                { icon: <Home size={16} />, label: 'شقق' },
                { icon: <Building size={16} />, label: 'فلل' },
                { icon: <Search size={16} />, label: 'مكاتب' },
                { icon: <MapPin size={16} />, label: 'أراضي' },
                { icon: <DollarSign size={16} />, label: 'اقتصادية' },
                { icon: <Sparkles size={16} />, label: 'فاخرة' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-full text-sm font-medium border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors whitespace-nowrap"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك أو اطرح سؤالك..."
                  className="w-full px-4 py-3 pr-12 rounded-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
                />
                <button
                  onClick={toggleVoice}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`h-12 w-12 flex items-center justify-center rounded-full ${
                  inputValue.trim() 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                } shadow-md transition-all`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              مدعوم بـ Gemini AI - مساعد عقاري ذكي بذكاء اصطناعي متقدم
            </p>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AIChat;
