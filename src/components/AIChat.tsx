import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً! أنا مساعدك الذكي للبحث عن العقارات. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('شقة') || lowerMessage.includes('شقق')) {
      return 'ممتاز! لدينا شقق رائعة في مناطق مختلفة. هل تفضل منطقة معينة؟ مثل الرياض أو جدة؟';
    } else if (lowerMessage.includes('فيلا') || lowerMessage.includes('فلل')) {
      return 'الفلل خيار رائع! لدينا فلل فاخرة مع حدائق خاصة. ما هو عدد الغرف المطلوب؟';
    } else if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة')) {
      return 'أسعارنا تنافسية جداً! يمكنك تحديد النطاق السعري من شريط البحث أعلاه، أو أخبرني بالمبلغ المناسب لك.';
    } else if (lowerMessage.includes('موقع') || lowerMessage.includes('منطقة')) {
      return 'لدينا عقارات في جميع المناطق الرئيسية: الرياض، جدة، الدمام، وغيرها. أي منطقة تفضل؟';
    } else if (lowerMessage.includes('إيجار')) {
      return 'بالطبع! لدينا عقارات مميزة للإيجار بأسعار مناسبة. هل تبحث عن إقامة قصيرة أم طويلة المدى؟';
    } else if (lowerMessage.includes('بيع')) {
      return 'لدينا عقارات متميزة للبيع! يمكنني مساعدتك في العثور على الخيار الأمثل. ما نوع العقار المطلوب؟';
    } else if (lowerMessage.includes('مرحبا') || lowerMessage.includes('سلام')) {
      return 'مرحباً بك! أنا مساعدك الذكي للعقارات. كيف يمكنني مساعدتك في العثور على العقار المثالي؟';
    } else {
      const responses = [
        'شكراً لتواصلك معنا! يمكنني مساعدتك في البحث عن العقار المناسب. ما هو نوع العقار الذي تبحث عنه؟',
        'أهلاً وسهلاً! لدينا مجموعة واسعة من العقارات. هل تفضل الشراء أم الإيجار؟',
        'مرحباً! يمكنني توجيهك لأفضل العقارات حسب احتياجاتك. أخبرني عن متطلباتك.',
        'يسعدني مساعدتك! ما هي المنطقة التي تفضلها للسكن؟'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop voice recognition
  };

  const quickActions = [
    'أبحث عن شقة للإيجار',
    'فيلات للبيع في الرياض',
    'مكاتب تجارية',
    'عقارات بسعر محدد'
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:shadow-strong transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 h-96 md:w-96 md:h-[500px] shadow-strong border-0 bg-card/95 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">المساعد الذكي</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs text-primary-foreground/80">متصل</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-primary-foreground" />
                    )}
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">اقتراحات سريعة:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer text-xs p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setInputValue(action)}
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoice}
                className={`${isListening ? 'bg-accent text-accent-foreground' : ''}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChat;