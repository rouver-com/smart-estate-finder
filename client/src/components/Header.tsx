import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, Bot, Home, Info, Contact, MessageCircle } from 'lucide-react';
import InspireAI from './InspireAI';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);

  const toggleAIAssistant = () => {
    setAIAssistantOpen(!aiAssistantOpen);
    document.body.classList.toggle('overflow-hidden', !aiAssistantOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle('overflow-hidden', !mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
    <>
      {/* AI Assistant Modal */}
      {aiAssistantOpen && <InspireAI onClose={toggleAIAssistant} />}

      <header className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
        scrolled ? 'shadow-sm py-2' : 'py-3'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <div className="bg-white w-6 h-6 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm"></div>
                </div>
              </div>
              <div className="ml-2">
                <h1 className="text-xl font-bold text-gray-800">Inspire</h1>
                <p className="text-xs text-gray-500 mt-0.5">Smart Real Estate</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2.5 text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium group relative"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-4/5" />
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={toggleAIAssistant}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
              >
                <Bot size={18} />
                <span>AI Assistant</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1 max-h-[calc(100vh-80px)] overflow-y-auto smooth-scroll">
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors duration-200"
                    onClick={toggleMobileMenu}
                  >
                    <div className="text-blue-500">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => {
                    toggleMobileMenu();
                    toggleAIAssistant();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                >
                  <Bot size={18} />
                  <span>AI Assistant</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Styles */}
      <style>{`
        .smooth-scroll {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }

        .smooth-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .smooth-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }

        .smooth-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }

        .smooth-scroll::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </>
  );
};

export default Header;