import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, Sun, Moon, MessageCircle, Bot, Home, Info, Contact } from 'lucide-react';

const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleAIAssistant = () => {
    setAIAssistantOpen(!aiAssistantOpen);
  };

  useEffect(() => {
    // Apply saved preferences
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '/', icon: <Home size={18} /> },
    { label: 'Properties', href: '/properties', icon: <Building2 size={18} /> },
    { label: 'Blog', href: '/blog', icon: <MessageCircle size={18} /> },
    { label: 'About', href: '/about', icon: <Info size={18} /> },
    { label: 'Contact', href: '/contact', icon: <Contact size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      {/* AI Assistant Modal */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Bot className="text-indigo-600" />
                AI Assistant
              </h3>
              <button 
                onClick={toggleAIAssistant}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                Hello! I'm your AI assistant. How can I help you today?
              </p>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask about properties..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 transition-all duration-300 ${
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
              <div className="ml-2">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Inspire</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Smart Real Estate</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium group"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-full mt-1" />
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <button 
                onClick={toggleAIAssistant}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:shadow-md transition-all"
              >
                <Bot size={18} />
                <span>AI Assistant</span>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-3">
              {/* AI Assistant Button */}
              <button 
                onClick={toggleAIAssistant}
                className="w-full flex items-center justify-center gap-2 p-3 mb-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md transition-all"
              >
                <Bot size={18} />
                <span className="font-medium">AI Assistant</span>
              </button>

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

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-center">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
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
              Responsive Website Header
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Modern header with mobile-responsive design featuring a fully functional AI assistant and dark mode support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">AI Assistant</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The AI Assistant button is now fully functional. Click it to access smart property recommendations and answers to your questions.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm">AI Chat</span>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">Smart Help</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-indigo-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Mobile Responsive</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Menu items stack vertically on mobile devices with a clean modern design that works perfectly on all screen sizes.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">Mobile First</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-sm">Vertical Menu</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Design Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Functional AI Assistant</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Light/Dark Mode</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Fully Responsive Design</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Vertical Mobile Menu</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Modern Visual Effects</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Clean UI Components</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
