import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, Send, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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
  timestamp?: string;
}

const supabaseUrl = 'https://stlgntcqzzgdsztjzwub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bGdudGNxenpnZHN6dGp6d3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTk5MzEsImV4cCI6MjA2OTc5NTkzMX0.EX_BYtg8Rwpmi9EH0qh3x1OsNJwDRTFVGiTm4MQgB1g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const InspireAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'مرحباً! أنا علي، مساعدك العقاري في Inspire. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [propertyResults, setPropertyResults] = useState<Property[]>([]);
  const [conversationState, setConversationState] = useState<'normal' | 'awaiting_contact' | 'awaiting_search'>('normal');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPopupRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI('AIzaSyCxcYVwbavYt3Ker_zz0zeKZ6p5p7X50es');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatPopupRef.current && !chatPopupRef.current.contains(event.target as Node) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const analyzeQuery = async (query: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Analyze this real estate query in Arabic and return JSON with:
      - propertyType (شقة, فيلا, أرض...)
      - location
      - bedrooms (number)
      - price (number)
      - action (بيع/ايجار)

      Query: "${query}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error analyzing query:', error);
      return {};
    }
  };

  const searchProperties = async (filters: any) => {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('is_active', true)
      .limit(5);

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
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        property_id: propertyId,
        name: 'عميل من الدردشة',
        message: `طلب معاينة للعقار ${propertyId}\n${contactInfo}`,
        inquiry_type: 'معاينة',
        status: 'جديد'
      }]);
    return !error;
  };

  const generateAIResponse = async (query: string, context: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `You are Ali, a real estate assistant for Inspire Properties. Respond in Arabic to this query:

      Context: ${context}
      Query: "${query}"

      Guidelines:
      - Be professional and friendly
      - Focus on real estate matters
      - Keep responses concise
      - Use bullet points when listing properties
      - Ask for clarification when needed
      - Always respond in Arabic`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      return 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة لاحقاً.';
    }
  };

  const formatResponse = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i}>{line.substring(2)}</li>;
      } else if (line.match(/^\d+\.\s/)) {
        return <li key={i}>{line.replace(/^\d+\.\s/, '')}</li>;
      } else if (line.trim() === '') {
        return <br key={i} />;
      } else {
        return <p key={i}>{line}</p>;
      }
    });
  };

  const generateResponse = async (query: string) => {
    if (conversationState === 'awaiting_contact') {
      setConversationState('normal');
      const propertyId = propertyResults[0]?.id;
      if (propertyId && await createInquiry(propertyId, query)) {
        return 'تم تسجيل طلبك بنجاح! سيتواصل معك فريق Inspire خلال 24 ساعة.';
      }
      return 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.';
    }

    if (conversationState === 'awaiting_search') {
      setConversationState('normal');
      const filters = await analyzeQuery(query);
      const properties = await searchProperties(filters);
      setPropertyResults(properties);

      if (properties.length > 0) {
        let response = `عثرت على ${properties.length} عقار:\n\n`;
        properties.forEach((prop, i) => {
          response += `${i+1}. ${prop.title}\n`;
          response += `- السعر: ${prop.price.toLocaleString()} ${prop.price_type}\n`;
          response += `- الموقع: ${prop.location}\n`;
          response += `- ${prop.bedrooms} غرف | ${prop.bathrooms} حمام | ${prop.area} م²\n\n`;
        });
        return response + 'لطلب معاينة، اكتب "معاينة العقار"';
      }
      return 'لم أعثر على عقارات مطابقة. هل تريد تعديل شروط البحث؟';
    }

    if (query.includes('معاينة') && propertyResults.length > 0) {
      setConversationState('awaiting_contact');
      return 'لحجز معاينة، يرجى إرسال:\n- الاسم الكامل\n- رقم الهاتف\n- الموعد المفضل';
    }

    if (query.includes('ابحث') || query.includes('عايز') || query.includes('أريد')) {
      setConversationState('awaiting_search');
      return 'ما نوع العقار الذي تبحث عنه؟\n(شقة، فيلا، أرض...) والموقع والميزانية إن وجدت';
    }

    const context = messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');
    return await generateAIResponse(query, context);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await generateResponse(inputValue);
      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'حدث خطأ في النظام. يرجى المحاولة لاحقاً.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="inspire-ai-container">
      {isOpen && (
        <div className="chat-popup" ref={chatPopupRef}>
          <div className="chat-header">
            <div className="header-content">
              <div className="avatar">
                <img src="https://via.placeholder.com/40" alt="مساعد Inspire" />
              </div>
              <div className="header-info">
                <h3>علي - المساعد العقاري</h3>
                <p className="status">متصل الآن</p>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-content">
                  {formatResponse(msg.content)}
                </div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="quick-questions">
              <button onClick={() => setInputValue("أبحث عن شقة للبيع")}>شقق للبيع</button>
              <button onClick={() => setInputValue("أريد فيلا للإيجار")}>فيلا للإيجار</button>
              <button onClick={() => setInputValue("ما هي خطوات الشراء؟")}>خطوات الشراء</button>
            </div>
            <div className="chat-input">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                rows={1}
              />
              <button 
                onClick={handleSend} 
                disabled={isTyping || !inputValue.trim()}
                className="send-btn"
              >
                {isTyping ? (
                  <div className="spinner"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        className={`assistant-button ${unreadCount > 0 ? 'has-unread' : ''}`} 
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>
    </div>
  );
};

export default InspireAI;