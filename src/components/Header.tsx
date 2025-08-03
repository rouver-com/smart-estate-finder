import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, Globe, Sun, Moon, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logoIcon from '@/assets/logo-icon.png';

const Header = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as 'ar' | 'en') || 'ar';
    }
    return 'ar';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    
    // Apply language direction
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
    
    // Store preference
    localStorage.setItem('language', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Store preference
    localStorage.setItem('theme', newTheme);
  };

  // Apply saved preferences on mount
  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Apply language direction
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, []);

  const menuItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'العقارات', href: '/properties' },
    { label: 'المقالات', href: '/blog' },
    { label: 'من نحن', href: '/about' },
    { label: 'تواصل معنا', href: '/contact' }
  ];

  const [showAI, setShowAI] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg bg-gradient-primary">
                <img 
                  src={logoIcon} 
                  alt="Inspire Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Inspire</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">العقارات الذكية</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* AI Assistant Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAI(!showAI)}
              className="gap-2 relative bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 text-primary"
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
              className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{language === 'ar' ? 'EN' : 'ع'}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-l border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-8 pt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg bg-gradient-primary">
                        <img 
                          src={logoIcon} 
                          alt="Inspire Logo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">Inspire</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">العقارات الذكية</p>
                    </div>
                  </div>

                  {/* Mobile AI Button */}
                  <Button
                    onClick={() => {
                      setShowAI(!showAI);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-primary hover:opacity-90 text-white gap-2 mb-4"
                  >
                    <Bot className="h-4 w-4" />
                    مساعد AI الذكي
                  </Button>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {menuItems.map((item, index) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-300 font-medium py-4 px-5 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 border border-transparent hover:border-primary/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="w-1 h-8 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <span className="text-lg font-medium">{item.label}</span>
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Theme & Language */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">الإعدادات</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleLanguage}
                          className="h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'EN' : 'عربي'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleTheme}
                          className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;