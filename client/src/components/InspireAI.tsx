import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// أنواع البيانات
interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  price_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

// Supabase
const supabase = createClient(
  'https://stlgntcqzzgdsztjzwub.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bGdudGNxenpnZHN6dGp6d3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTk5MzEsImV4cCI6MjA2OTc5NTkzMX0.EX_BYtg8Rwpmi9EH0qh3x1OsNJwDRTFVGiTm4MQgB1g'
);

// مفاتيح Gemini API
const GEMINI_API_KEY = 'AIzaSyC4D8BH62w1O3X0Li3e_bEc8hfk7CP9CLI';
const GEMINI_MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${GEMINI_API_KEY}`;

// استخدام fetch مع Gemini
async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    const res = await fetch(GEMINI_MODEL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (res.status === 429) {
      return 'تم تجاوز الحد اليومي لاستخدام الخدمة. يرجى المحاولة لاحقاً.';
    }

    const data = await res.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'لم يتم الحصول على رد من النموذج.';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return 'حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.';
  }
}

// المكون الرئيسي
const SmartEstateAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'مرحباً! أنا علي، مساعدك العقاري في Inspire. كيف يمكنني مساعدتك اليوم؟'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [propertyResults, setPropertyResults] = useState<Property[]>([]);
  const [conversationState, setConversationState] = useState<'normal' | 'awaiting_contact' | 'awaiting_search'>('normal');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  const analyzeQuery = async (query: string) => {
    const prompt = `حلل استفسار العقار التالي بالعربية وأرجع JSON يحتوي على:
- propertyType (شقة، فيلا، أرض...)
- location
- bedrooms (عدد الغرف)
- price (السعر)
- action (بيع أو ايجار)

الاستفسار: "${query}"`;

    const response = await generateGeminiResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  };

  const searchProperties = async (filters: any) => {
    let query = supabase.from('properties').select('*').eq('is_active', true).limit(5);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);
    if (filters.price) {
      const price = Number(filters.price);
      query = query.lte('price', price * 1.2).gte('price', price * 0.8);
    }
    if (filters.bedrooms) query = query.eq('bedrooms', Number(filters.bedrooms));
    if (filters.action === 'ايجار') query = query.eq('price_type', 'للإيجار');
    if (filters.action === 'بيع') query = query.eq('price_type', 'للبيع');

    const { data, error } = await query;
    return data || [];
  };

  const createInquiry = async (propertyId: string, contactInfo: string) => {
    const { error } = await supabase.from('inquiries').insert([{
      property_id: propertyId,
      name: 'عميل من الدردشة',
      message: `طلب معاينة للعقار ${propertyId}\n${contactInfo}`,
      inquiry_type: 'معاينة',
      status: 'جديد'
    }]);
    return !error;
  };

  const generateAIResponse = async (query: string, context: string) => {
    const prompt = `أنت مساعد عقاري ذكي اسمه علي. رد على الاستفسار التالي بالعربية:

السياق: 
${context}

الاستفسار:
"${query}"

- كن مختصرًا واحترافيًا
- ركز على العقارات
- لا ترد على أشياء خارج السياق العقاري
- استخدم أسلوب ودود وبالعربية فقط`;

    return await generateGeminiResponse(prompt);
  };

  const generateResponse = async (query: string) => {
    if (conversationState === 'awaiting_contact') {
      setConversationState('normal');
      const propertyId = propertyResults[0]?.id;
      if (propertyId && await createInquiry(propertyId, query)) {
        return 'تم تسجيل طلبك! سنتواصل معك خلال 24 ساعة.';
      }
      return 'حدث خطأ أثناء حفظ الطلب. حاول مرة أخرى.';
    }

    if (conversationState === 'awaiting_search') {
      setConversationState('normal');
      const filters = await analyzeQuery(query);
      const properties = await searchProperties(filters);
      setPropertyResults(properties);

      if (properties.length > 0) {
        let response = `وجدت ${properties.length} عقار:\n\n`;
        properties.forEach((prop, i) => {
          response += `${i + 1}. ${prop.title}\n`;
          response += `السعر: ${prop.price.toLocaleString()} ${prop.price_type}\n`;
          response += `المساحة: ${prop.area} م² | ${prop.bedrooms} غرف\n\n`;
        });
        return response + 'لطلب معاينة، اكتب "معاينة العقار".';
      }
      return 'لم أجد عقارات مطابقة. هل ترغب في تعديل شروط البحث؟';
    }

    if (query.includes('معاينة') && propertyResults.length > 0) {
      setConversationState('awaiting_contact');
      return 'لحجز معاينة، يرجى إرسال:\n- الاسم الكامل\n- رقم الهاتف\n- الموعد المفضل';
    }

    if (query.includes('ابحث') || query.includes('عايز') || query.includes('أريد')) {
      setConversationState('awaiting_search');
      return 'ما نوع العقار الذي تبحث عنه؟ (شقة، فيلا، أرض...) والموقع والميزانية إن وجدت؟';
    }

    const context = messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');
    return await generateAIResponse(query, context);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const now = Date.now();
    if (now - lastRequestTime < 4000) {
      alert('يرجى الانتظار قليلاً قبل إرسال استفسار جديد.');
      return;
    }
    setLastRequestTime(now);

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await generateResponse(inputValue);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'حدث خطأ تقني. يرجى المحاولة لاحقاً.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col" style={{ height: '500px' }}>
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center rounded-t-lg">
            <div className="font-medium flex items-center gap-2">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <span>علي - المساعد العقاري</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-100' : 'bg-white border border-gray-200'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartEstateAI;
