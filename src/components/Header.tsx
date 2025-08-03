import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, Globe, Sun, Moon, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logoIcon from '@/assets/logo-icon.png';

const Header = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('language') as 'ar' | 'en') || 'ar';
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
    localStorage.setItem('language', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
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
    { label: 'الرئيسية', href: '/', icon: <Building2 size={18} /> },
    { label: 'العقارات', href: '/properties', icon: <Building2 size={18} /> },
    { label: 'المقالات', href: '/blog', icon: <MessageCircle size={18} /> },
    { label: 'من نحن', href: '/about', icon: <Building2 size={18} /> },
    { label: 'تواصل معنا', href: '/contact', icon: <MessageCircle size={18} /> }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b transition-all duration-300 ${
      scrolled 
        ? 'border-gray-200/70 dark:border-gray-800/70 shadow-md py-2' 
        : 'border-transparent py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <img 
                  src={logoIcon} 
                  alt="Inspire Logo" 
                  className="w-full h-full object-cover p-1.5"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Inspire</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">العقارات الذكية</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium group"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-4/5" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* AI Assistant Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAI(!showAI)}
              className="gap-1.5 relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI مساعد</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{language === 'ar' ? 'English' : 'العربية'}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ml-1"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={language === 'ar' ? 'left' : 'right'} 
                className="w-[85vw] max-w-sm bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-0"
              >
                <div className="flex flex-col gap-6 pt-6 h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 pb-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <img 
                          src={logoIcon} 
                          alt="Inspire Logo" 
                          className="w-full h-full object-cover p-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Inspire</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">العقارات الذكية</p>
                    </div>
                  </div>

                  {/* Mobile AI Button */}
                  <Button
                    onClick={() => {
                      setShowAI(!showAI);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white gap-2 mb-2 shadow-lg shadow-blue-500/20"
                  >
                    <Bot className="h-4 w-4" />
                    مساعد AI الذكي
                  </Button>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-1 flex-grow">
                    {menuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="text-blue-500 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-base font-medium">{item.label}</span>
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Theme & Language */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        onClick={toggleLanguage}
                      >
                        <Globe className="h-4 w-4 mr-3" />
                        {language === 'ar' ? 'تغيير إلى الإنجليزية' : 'Switch to Arabic'}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        onClick={toggleTheme}
                      >
                        {theme === 'light' ? (
                          <>
                            <Moon className="h-4 w-4 mr-3" />
                            تفعيل الوضع الليلي
                          </>
                        ) : (
                          <>
                            <Sun className="h-4 w-4 mr-3" />
                            تفعيل الوضع النهاري
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* AI Assistant Panel (Simplified) */}
      {showAI && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[60] flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-bold">مساعد Inspire العقاري</h3>
            </div>
            <button 
              onClick={() => setShowAI(false)}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 flex-grow overflow-auto">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm mb-4">
              مرحباً! كيف يمكنني مساعدتك اليوم في البحث عن العقار المثالي؟
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
            <input 
              type="text" 
              placeholder="اكتب رسالتك هنا..." 
              className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-l-lg px-4 py-2 text-sm focus:outline-none"
            />
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 rounded-r-lg hover:opacity-90 transition-opacity">
              إرسال
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
