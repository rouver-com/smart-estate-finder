import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Phone, Mail } from 'lucide-react';
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً! أنا Inspire، مساعد عقاري الذكي 🏠 لدي وصول شامل لجميع بيانات الشركة: \n\n📋 معلومات التواصل والشركة\n🏘️ قاعدة بيانات العقارات الكاملة\n📍 تفاصيل المواقع والمناطق\n\n💼 أستطيع مساعدتك في:\n✅ البحث المتقدم عن العقارات\n✅ فتح روابط مباشرة للعقارات\n✅ ترتيب المعاينات\n✅ تقديم الاستشارات العقارية\n\nكيف يمكنني خدمتك اليوم؟',
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
      return `📞 معلومات التواصل معنا:\n\n🏢 عقاري الذكي - Smart Estate Finder\n📱 الهاتف: +20 100 123 4567\n📧 البريد: info@smartestate.com\n🌐 الموقع: www.smartestate.com\n📍 العنوان: شارع التحرير، وسط القاهرة\n\n⏰ ساعات العمل:\nالأحد - الخميس: 9 صباحاً - 6 مساءً\nالجمعة - السبت: 10 صباحاً - 4 مساءً\n\nهل تريد تحديد موعد لزيارة مكتبنا؟`;
    }

    if (lowerMessage.includes('عن الشركة') || lowerMessage.includes('من نحن') || lowerMessage.includes('الشركة')) {
      return `🏢 عن شركة عقاري الذكي:\n\n✨ نحن الشركة الرائدة في مجال الوساطة العقارية بمصر\n🎯 خبرة +15 سنة في السوق العقاري\n🏆 أكثر من 5000 عقار تم بيعه بنجاح\n👥 فريق من 50+ خبير عقاري محترف\n🔍 تقنيات ذكية للبحث والمطابقة\n\n💫 مهمتنا: جعل حلم المنزل حقيقة لكل عميل\n🎪 رؤيتنا: أن نكون الخيار الأول للعقارات في الشرق الأوسط\n\n🌟 لماذا نحن الأفضل؟\n• استشارات مجانية\n• خدمة 24/7\n• أسعار تنافسية\n• ضمان قانوني كامل`;
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

    if (lowerMessage.includes('موقع') || lowerMessage.includes('منطقة') || lowerMessage.includes('فين') || lowerMessage.includes('أماكن')) {
      return `🗺️ مناطقنا المتاحة في جميع أنحاء مصر:\n\n🏙️ القاهرة:\n• مدينة نصر | التجمع الخامس | الزمالك\n• المعادي | مصر الجديدة | المقطم\n• العاصمة الإدارية الجديدة\n\n🏖️ الإسكندرية:\n• سموحة | سيدي جابر | العجمي\n• سيدي بشر | المنتزه | برج العرب\n\n🌆 الجيزة:\n• المهندسين | الدقي | الشيخ زايد\n• 6 أكتوبر | الهرم | العمرانية\n\n🏖️ المدن الساحلية:\n• الغردقة | شرم الشيخ | العين السخنة\n\n🔍 [تصفح العقارات حسب المنطقة](/properties)\n\nأي منطقة تهمك أكثر؟`;
    }

    if (lowerMessage.includes('إيجار') || lowerMessage.includes('تأجير')) {
      const rentals = properties.filter(p => p.price_type === 'للإيجار');
      if (rentals.length > 0) {
        return `لدي عقارات ممتازة للإيجار! الأسعار تبدأ من ${Math.min(...rentals.map(p => p.price)).toLocaleString()} جنيه شهرياً. هل تبحث عن سكن أم مكتب تجاري؟`;
      }
      return 'بالطبع! عندي خيارات إيجار رائعة بأسعار تنافسية. أخبرني عن احتياجاتك ومدة الإيجار المطلوبة.';
    }

    if (lowerMessage.includes('بيع') || lowerMessage.includes('شراء') || lowerMessage.includes('تمليك')) {
      const forSale = properties.filter(p => p.price_type === 'للبيع');
      if (forSale.length > 0) {
        return `ممتاز! لدي ${forSale.length} عقار متاح للبيع الآن. أسعار متنوعة تبدأ من ${Math.min(...forSale.map(p => p.price)).toLocaleString()} جنيه. ما نوع العقار المطلوب وفي أي منطقة؟`;
      }
      return 'رائع! لدي مجموعة كبيرة من العقارات للبيع. أخبرني عن متطلباتك وسأرشح لك أفضل الخيارات!';
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
      return `🔍 البحث المتقدم متاح الآن!\n\n📋 يمكنك البحث بـ:\n• نوع العقار (شقة، فيلا، مكتب)\n• المنطقة والحي المفضل\n• نطاق السعر (للبيع/للإيجار)\n• عدد الغرف والحمامات\n• المميزات (مسبح، موقف، حديقة)\n• المساحة والطابق\n\n🎯 خيارات البحث:\n🔗 [صفحة البحث المتقدم](/properties)\n🔗 [العقارات المميزة](/#featured)\n🔗 [جميع العقارات](/properties)\n\n💬 أو أخبرني بمتطلباتك بالتفصيل وسأبحث لك فوراً!\nمثال: "أريد شقة 3 غرف في القاهرة بسعر أقل من 2 مليون"`;
    }

    if (lowerMessage.includes('تفاصيل') || lowerMessage.includes('مواصفات') || lowerMessage.includes('أوصاف')) {
      return 'بالتأكيد! أستطيع إعطاءك تفاصيل كاملة عن أي عقار: المساحة، عدد الغرف، التشطيبات، المرافق، الصور، وحتى فيديو افتراضي للعقار. أي عقار تريد تفاصيله؟';
    }

    if (lowerMessage.includes('تمويل') || lowerMessage.includes('قرض') || lowerMessage.includes('تقسيط')) {
      return 'نعم! أساعدك في ترتيب التمويل العقاري مع أفضل البنوك. لدينا برامج تقسيط تصل إلى 25 سنة بأقل مقدم (5%) وفوائد تنافسية. هل تريد تفاصيل التمويل؟';
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
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-primary shadow-glow hover:shadow-strong transition-all duration-300 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-bounce text-xs text-accent-foreground flex items-center justify-center font-bold">
            AI
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 h-[600px] md:w-96 md:h-[650px] shadow-strong border-0 bg-card/98 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground">Inspire AI</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs text-primary-foreground/90">خبير العقارات الذكي</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-primary text-primary-foreground ml-2'
                      : 'bg-muted text-foreground mr-2'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-primary-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed">
                        {message.content.split('\n').map((line, lineIndex) => (
                          <div key={lineIndex}>
                            {line.includes('[') && line.includes('](') ? (
                              // Handle markdown-style links
                              line.split(/(\[.*?\]\(.*?\))/).map((part, partIndex) => {
                                const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                                if (linkMatch) {
                                  return (
                                    <button
                                      key={partIndex}
                                      onClick={() => window.location.href = linkMatch[2]}
                                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                    >
                                      {linkMatch[1]}
                                    </button>
                                  );
                                }
                                return part;
                              })
                            ) : (
                              line
                            )}
                            {lineIndex < message.content.split('\n').length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs opacity-70 mt-2 block">
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
                <div className="bg-muted p-3 rounded-2xl mr-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-xs text-muted-foreground">Inspire يكتب...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-border bg-muted/50">
              <p className="text-xs text-muted-foreground mb-3 font-medium">💡 اقتراحات سريعة:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer text-xs p-2 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 text-center justify-center"
                    onClick={() => setInputValue(action)}
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-background/95">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={askingForInfo ? "اكتب إجابتك..." : "اسأل Inspire عن أي شيء..."}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoice}
                className={`${isListening ? 'bg-accent text-accent-foreground' : ''} transition-all`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim()}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {userInfo.name && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{userInfo.name}</span>
                {userInfo.email && (
                  <>
                    <Mail className="h-3 w-3 ml-2" />
                    <span>{userInfo.email}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default InspireAI;