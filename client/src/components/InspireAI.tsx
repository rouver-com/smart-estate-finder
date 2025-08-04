import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Phone, Mail, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
}

const InspireAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً! أنا Inspire، مساعدك العقاري الذكي 🏠\n\nأستطيع مساعدتك في:\n✅ البحث عن العقارات\n✅ ترتيب المعاينات\n✅ تقديم الاستشارات\n\nكيف يمكنني خدمتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [askingForInfo, setAskingForInfo] = useState(false);
  const [currentInfoField, setCurrentInfoField] = useState<'name' | 'email' | 'phone' | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true);
      
      if (!error) {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const saveConversation = async () => {
    try {
      await supabase
        .from('chat_conversations')
        .upsert({
          session_id: sessionId,
          user_name: userInfo.name,
          user_email: userInfo.email,
          user_phone: userInfo.phone,
          conversation_data: JSON.stringify(messages),
          status: 'نشط'
        }, { onConflict: 'session_id' });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

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

    // Handle user info collection
    if (askingForInfo && currentInfoField) {
      setUserInfo(prev => ({ ...prev, [currentInfoField]: inputValue }));
      
      if (currentInfoField === 'name') {
        setCurrentInfoField('email');
        setTimeout(() => {
          setIsTyping(false);
          const botResponse: Message = {
            id: Date.now() + 1,
            type: 'bot',
            content: `شكراً ${inputValue}! يمكنك مشاركة بريدك الإلكتروني معي؟`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1000);
        return;
      } else if (currentInfoField === 'email') {
        setCurrentInfoField('phone');
        setTimeout(() => {
          setIsTyping(false);
          const botResponse: Message = {
            id: Date.now() + 1,
            type: 'bot',
            content: 'ممتاز! وأخيراً، ما هو رقم هاتفك للتواصل؟',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1000);
        return;
      } else if (currentInfoField === 'phone') {
        setAskingForInfo(false);
        setCurrentInfoField(null);
        setTimeout(() => {
          setIsTyping(false);
          const botResponse: Message = {
            id: Date.now() + 1,
            type: 'bot',
            content: `شكراً جزيلاً! تم حفظ بياناتك بنجاح. سأتواصل معك قريباً على ${inputValue}. الآن، كيف يمكنني مساعدتك في البحث عن العقار المناسب؟`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          saveConversation();
        }, 1000);
        return;
      }
    }

    // Generate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: getInspireResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      saveConversation();
    }, 1500);
  };

  const getInspireResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Company and contact information
    if (lowerMessage.includes('تواصل') || lowerMessage.includes('اتصال') || lowerMessage.includes('رقم') || lowerMessage.includes('هاتف')) {
      return `📞 معلومات التواصل معنا:\n\n🏢 عقاري الذكي\n📱 الهاتف: +20 100 123 4567\n📧 البريد: info@smartestate.com\n📍 العنوان: شارع التحرير، وسط القاهرة\n\n⏰ ساعات العمل:\nالأحد - الخميس: 9 صباحاً - 6 مساءً\nالجمعة - السبت: 10 صباحاً - 4 مساءً\n\nهل تريد تحديد موعد لزيارة مكتبنا؟`;
    }

    if (lowerMessage.includes('عن الشركة') || lowerMessage.includes('من نحن') || lowerMessage.includes('الشركة')) {
      return `🏢 عن شركة عقاري الذكي:\n\n✨ نحن الشركة الرائدة في مجال الوساطة العقارية بمصر\n🎯 خبرة +15 سنة في السوق العقاري\n🏆 أكثر من 5000 عقار تم بيعه بنجاح\n👥 فريق من 50+ خبير عقاري محترف\n\n💫 مهمتنا: جعل حلم المنزل حقيقة لكل عميل\n🎪 رؤيتنا: أن نكون الخيار الأول للعقارات في الشرق الأوسط`;
    }

    // Property search and recommendations  
    if (lowerMessage.includes('شقة') || lowerMessage.includes('شقق')) {
      const apartments = properties.filter(p => p.property_type === 'شقة');
      if (apartments.length > 0) {
        const apt = apartments[0];
        return `🏠 وجدت شقق ممتازة لك!\n\n🌟 مثال: "${apt.title}"\n📍 الموقع: ${apt.location}\n💰 السعر: ${apt.price.toLocaleString()} جنيه\n🛏️ ${apt.bedrooms} غرف نوم | 🚿 ${apt.bathrooms} حمام\n\n🔗 [اضغط هنا لرؤية التفاصيل الكاملة](/property/${apt.id})\n\nهل تريد المزيد من الخيارات أم تفضل البحث بمعايير أخرى؟`;
      }
      return 'لدينا شقق متنوعة في مناطق مختلفة! أي منطقة تفضل؟ القاهرة، الإسكندرية، أم الجيزة؟';
    }

    if (lowerMessage.includes('فيلا') || lowerMessage.includes('فلل')) {
      const villas = properties.filter(p => p.property_type === 'فيلا');
      if (villas.length > 0) {
        const villa = villas[0];
        return `🏰 فيلا فاخرة متاحة الآن!\n\n✨ "${villa.title}"\n📍 ${villa.location}\n💎 السعر: ${villa.price.toLocaleString()} جنيه\n🏡 ${villa.bedrooms} غرف نوم | 📐 ${villa.area} م²\n\n🔗 [شاهد الفيلا كاملة هنا](/property/${villa.id})\n\n🌟 مميزات خاصة: حديقة، مسبح، موقف سيارات\nهل تريد ترتيب معاينة فورية؟`;
      }
      return 'الفلل اختيار ممتاز! لدي فلل فاخرة مع حدائق ومسابح خاصة. ما المنطقة المفضلة لك؟';
    }

    if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة') || lowerMessage.includes('كام') || lowerMessage.includes('بكام')) {
      return `💰 دليل الأسعار الحالي (بالجنيه المصري):\n\n🏠 الشقق:\n• 1-2 غرفة: 500,000 - 1,500,000 جنيه\n• 3 غرف: 1,500,000 - 3,000,000 جنيه\n• 4+ غرف: 3,000,000 - 8,000,000 جنيه\n\n🏰 الفلل:\n• عادية: 5,000,000 - 15,000,000 جنيه\n• فاخرة: 15,000,000 - 50,000,000 جنيه\n\n💼 الإيجار الشهري:\n• شقق: 3,000 - 25,000 جنيه\n• فلل: 15,000 - 100,000 جنيه\n\n🔍 [ابحث حسب ميزانيتك هنا](/properties)\n\nما النطاق المناسب لك؟ سأعرض عليك أفضل الخيارات!`;
    }

    if (lowerMessage.includes('معاينة') || lowerMessage.includes('زيارة') || lowerMessage.includes('شوف')) {
      if (!userInfo.name) {
        setAskingForInfo(true);
        setCurrentInfoField('name');
        return 'ممتاز! لترتيب معاينة، سأحتاج بعض المعلومات منك. ما اسمك الكريم؟';
      }
      return `بالطبع ${userInfo.name}! يمكنني ترتيب معاينة لك اليوم أو غداً. متى يناسبك الوقت؟ صباحاً أم مساءً؟`;
    }

    if (lowerMessage.includes('بحث') || lowerMessage.includes('ابحث') || lowerMessage.includes('دور') || lowerMessage.includes('اعرض') || lowerMessage.includes('أعرض')) {
      return `🔍 البحث المتقدم متاح الآن!\n\n📋 يمكنك البحث بـ:\n• نوع العقار (شقة، فيلا، مكتب)\n• المنطقة والحي المفضل\n• نطاق السعر (للبيع/للإيجار)\n• عدد الغرف والحمامات\n• المميزات (مسبح، موقف، حديقة)\n\n🎯 خيارات البحث:\n🔗 [صفحة البحث المتقدم](/properties)\n\n💬 أو أخبرني بمتطلباتك بالتفصيل وسأبحث لك فوراً!\nمثال: "أريد شقة 3 غرف في القاهرة بسعر أقل من 2 مليون"`;
    }

    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('سلام') || lowerMessage.includes('أهلا') || lowerMessage.includes('هاي')) {
      return 'أهلاً وسهلاً بك! أنا Inspire، خبير العقارات الذكي 🏡 معي قاعدة بيانات شاملة لجميع العقارات المتاحة. أخبرني: تبحث عن شقة، فيلا، مكتب، أم أرض؟';
    }

    if (lowerMessage.includes('شكرا') || lowerMessage.includes('شكراً')) {
      return 'العفو! دائماً في خدمتك 😊 هل تحتاج مساعدة في أي شيء آخر؟ يمكنني مساعدتك في البحث أو ترتيب المعاينات أو الاستشارات العقارية.';
    }

    // Default intelligent responses
    const responses = [
      `أفهم احتياجك تماماً! بصفتي خبير عقاري، أنصحك بـ: الموقع أهم من المساحة، استثمر في منطقة نامية، واحرص على سند ملكية سليم. ما نوع العقار الذي يهمك؟`,
      `ممتاز! كخبير عقاري، عندي نصائح ذهبية لك: تأكد من تراخيص البناء، افحص شبكة المواصلات، واعرف خطط التطوير المستقبلية للمنطقة. أي منطقة تفكر فيها؟`,
      `رائع! Inspire هنا لخدمتك ✨ أقدر أرشح لك عقارات حسب: ميزانيتك، المنطقة المفضلة، نوع العقار، والاستخدام (سكن/استثمار). شاركني احتياجاتك!`,
      `بإمكاني مساعدتك في كل شيء: البحث المتقدم، تقييم الأسعار، النصائح القانونية، التمويل العقاري، وحتى التفاوض! ما الذي تريد البدء به؟`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  const quickActions = [
    'أبحث عن شقة للإيجار',
    'فيلا للبيع في القاهرة', 
    'عقارات بميزانية محددة',
    'أريد معاينة عقار',
    'نصائح للاستثمار العقاري',
    'تمويل عقاري'
  ];

  return (
    <>
      {/* Floating Chat Button - Modern Style */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-2xl bg-gradient-primary shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 border border-white/20"
          size="icon"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </Button>
      )}

      {/* Modern Chat Interface - ChatGPT Style */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-96 shadow-[0_20px_80px_rgba(0,0,0,0.15)] border border-border/10 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}>
          {/* Modern Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Inspire AI</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">مساعدك العقاري الذكي</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Chat Messages Area */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-0">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-primary' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      {/* Message Content */}
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-primary text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line.includes('[') && line.includes('](/') ? (
                                <span>
                                  {line.split(/(\[.*?\]\(.*?\))/g).map((part, partIndex) => {
                                    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                                    if (linkMatch) {
                                      return (
                                        <button
                                          key={partIndex}
                                          className={`underline hover:no-underline ${
                                            message.type === 'user' ? 'text-white' : 'text-primary'
                                          }`}
                                          onClick={() => window.location.href = linkMatch[2]}
                                        >
                                          {linkMatch[1]}
                                        </button>
                                      );
                                    }
                                    return part;
                                  })}
                                </span>
                              ) : (
                                line
                              )}
                              {index < message.content.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input Section - ChatGPT Style */}
          {!isMinimized && (
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
              {/* Quick Actions */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {quickActions.slice(0, 3).map((action, index) => (
                    <button
                      key={index}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                      onClick={() => setInputValue(action)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box */}
              <div className="relative">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="رسالة Inspire AI..."
                  className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="icon"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InspireAI;