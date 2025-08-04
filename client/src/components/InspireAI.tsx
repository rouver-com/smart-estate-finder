import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, Send, X, ChevronDown, ChevronUp, Phone } from 'lucide-react';
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
  const [isMinimized, setIsMinimized] = useState(false);
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini مع النموذج القديم
  const genAI = new GoogleGenerativeAI('AIzaSyCxcYVwbavYt3Ker_zz0zeKZ6p5p7X50es');
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatPopupRef.current && !chatPopupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const analyzeQuery = async (query: string) => {
    try {
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
      const prompt = `You are Ali, a real estate assistant for Inspire Properties. Respond in Arabic to this query:

      Previous conversation context: ${context}
      New query: "${query}"

      Guidelines:
      - Be professional and friendly
      - Focus on real estate matters
      - Keep responses concise
      - Use bullet points when listing properties
      - Ask for clarification when needed
      - Always respond in Arabic
      - At the end of each response, add a WhatsApp contact prompt with a WhatsApp icon`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      return 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة لاحقاً.';
    }
  };

  const formatResponse = (text: string) => {
    const whatsappNumber = '20123456789'; // Default number - you can change this
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    const lines = text.split('\n');
    const elements = lines.map((line, i) => {
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

    return (
      <>
        {elements}
        <div className="whatsapp-prompt">
          <p>يمكنك التواصل معنا مباشرة على واتساب</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
            <Phone size={16} /> واتساب الآن
          </a>
        </div>
      </>
    );
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

    const context = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
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

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="inspire-ai-container">
      {isOpen && (
        <div className={`chat-popup ${isMinimized ? 'minimized' : ''}`} ref={chatPopupRef}>
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
            <div className="header-actions">
              <button className="minimize-btn" onClick={toggleMinimize}>
                {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="close-btn" onClick={toggleChat}>
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages" ref={chatContainerRef}>
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
            </>
          )}
        </div>
      )}

      <button 
        className={`assistant-button ${unreadCount > 0 ? 'has-unread' : ''}`} 
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      <style jsx>{`
        .inspire-ai-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .chat-popup {
          width: 400px;
          max-width: 90vw;
          height: 70vh;
          max-height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .chat-popup.minimized {
          height: 60px;
        }

        .chat-header {
          background: #2c3e50;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .status {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .minimize-btn, .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .minimize-btn:hover, .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f5f7fa;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          position: relative;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
          align-self: flex-end;
          background: #2c3e50;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.assistant {
          align-self: flex-start;
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-bottom-left-radius: 4px;
        }

        .message-content {
          line-height: 1.5;
        }

        .message-content p {
          margin: 0 0 8px 0;
        }

        .message-content ul {
          padding-left: 20px;
          margin: 8px 0;
        }

        .message-time {
          font-size: 10px;
          opacity: 0.7;
          text-align: right;
          margin-top: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #ccc;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .chat-input-container {
          border-top: 1px solid #e0e0e0;
          background: white;
          padding: 12px;
        }

        .quick-questions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .quick-questions button {
          background: #f0f2f5;
          border: none;
          border-radius: 16px;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .quick-questions button:hover {
          background: #e0e0e0;
        }

        .chat-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-input textarea {
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          padding: 10px 16px;
          resize: none;
          font-family: inherit;
          font-size: 14px;
          min-height: 40px;
          max-height: 120px;
          outline: none;
          transition: border 0.2s;
        }

        .chat-input textarea:focus {
          border-color: #2c3e50;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2c3e50;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .send-btn:disabled {
          background: #b0b0b0;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .assistant-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #2c3e50;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 1001;
        }

        .assistant-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .assistant-button.has-unread::after {
          content: '';
          position: absolute;
          top: 5px;
          right: 5px;
          width: 12px;
          height: 12px;
          background: #e74c3c;
          border-radius: 50%;
          border: 2px solid #2c3e50;
        }

        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .whatsapp-prompt {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px dashed #e0e0e0;
          text-align: center;
          font-size: 14px;
          color: #555;
        }

        .whatsapp-prompt p {
          margin-bottom: 8px;
        }

        .whatsapp-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #25D366;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }

        .whatsapp-button:hover {
          background: #128C7E;
        }
      `}</style>
    </div>
  );
};

export default InspireAI;