import React, { useState } from 'react';
import { Building2, Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logoIcon from '@/assets/logo-icon.png';

const Header = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    // In a real app, this would trigger language change
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // In a real app, this would toggle dark mode
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'العقارات', href: '/properties' },
    { label: 'المقالات', href: '/blog' },
    { label: 'من نحن', href: '/about' },
    { label: 'تواصل معنا', href: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow">
                <img 
                  src={logoIcon} 
                  alt="عقاري الذكي" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">عقاري الذكي</h1>
              <p className="text-xs text-muted-foreground">Smart Estate Finder</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* CTA Button */}
            <Button 
              className="hidden sm:flex bg-gradient-secondary hover:opacity-90 text-secondary-foreground shadow-medium"
              onClick={() => window.location.href = '/properties'}
            >
              إضافة عقار
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-bold">عقاري الذكي</h2>
                      <p className="text-xs text-muted-foreground">Smart Estate Finder</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  {/* Mobile CTA */}
                  <Button 
                    className="bg-gradient-secondary hover:opacity-90 text-secondary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    إضافة عقار
                  </Button>
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