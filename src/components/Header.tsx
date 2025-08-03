import { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon, MessageCircle, Home, Building, Info, Contact } from 'lucide-react';

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
    { label: 'العقارات', href: '/properties', icon: <Building size={18} /> },
    { label: 'المقالات', href: '/blog', icon: <MessageCircle size={18} /> },
    { label: 'من نحن', href: '/about', icon: <Info size={18} /> },
    { label: 'تواصل معنا', href: '/contact', icon: <Contact size={18} /> }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-3'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <div className="bg-white w-6 h-6 md:w-7 md:h-7 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Inspire</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">العقارات الذكية</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <Globe size={18} />
              <span className="text-sm">{language === 'ar' ? 'English' : 'العربية'}</span>
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
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            {/* Mobile Navigation */}
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

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Globe size={16} />
                <span className="text-sm">{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
              
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-sm">{theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
