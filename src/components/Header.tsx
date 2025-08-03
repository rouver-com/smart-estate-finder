import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, Globe, Sun, Moon, MessageCircle, Bot, Home, Info, Contact } from 'lucide-react';

const Header = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    // Apply saved preferences
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    
    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'الرئيسية', href: '/', icon: <Home size={18} /> },
    { label: 'العقارات', href: '/properties', icon: <Building2 size={18} /> },
    { label: 'المقالات', href: '/blog', icon: <MessageCircle size={18} /> },
    { label: 'من نحن', href: '/about', icon: <Info size={18} /> },
    { label: 'تواصل معنا', href: '/contact', icon: <Contact size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 ${
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
              <div className={`${language === 'ar' ? 'mr-2' : 'ml-2'}`}>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Inspire</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">العقارات الذكية</p>
              </div>
            </div>

            {/* Desktop Navigation - Only visible on larger screens */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium group ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-full mt-1" />
                </a>
              ))}
            </nav>

            {/* Desktop Actions - Only visible on larger screens */}
            <div className="hidden lg:flex items-center gap-1">
              <button 
                onClick={() => {}}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400"
              >
                <Bot size={18} />
                <span>AI مساعد</span>
              </button>
              
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Globe size={18} />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
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

        {/* Mobile Menu - Fixed to stack items vertically */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-3">
              {/* AI Assistant Button */}
              <button 
                onClick={() => {}}
                className="w-full flex items-center justify-center gap-2 p-3 mb-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                <Bot size={18} />
                <span className="font-medium">مساعد AI الذكي</span>
              </button>

              {/* Mobile Navigation - Always vertical stack */}
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

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-2">
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <Globe size={16} />
                  <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                </button>
                
                <button 
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>{theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="pt-24 container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              رأس موقع متجاوب متكامل
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              تم حل مشكلة الترتيب في وضع الموبيل مع دعم كامل للغة العربية والإنجليزية. عناصر القائمة تظهر بشكل عمودي في جميع الأجهزة مع الحفاظ على التصميم العصري.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">دعم كامل للغة العربية</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                تم تصميم الرأس ليعمل بشكل مثالي مع اتجاه النص من اليمين لليسار (RTL) للغة العربية ومن اليسار لليمين (LTR) للإنجليزية.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm">RTL Support</span>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">LTR Support</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-indigo-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">تصميم متجاوب للجوال</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                عناصر القائمة تظهر بشكل عمودي في أجهزة الجوال مع الحفاظ على التصميم العصري والأنيق في جميع الأجهزة.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">Mobile First</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-sm">Vertical Menu</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">مزايا التصميم</h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>دعم كامل للغة العربية والإنجليزية</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>وضع ليلي ونهاري</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>تصميم متجاوب لجميع الأجهزة</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>قائمة عمودية للجوال</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>تأثيرات بصرية أنيقة</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>مساعد ذكاء اصطناعي مدمج</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
