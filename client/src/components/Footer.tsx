import React from 'react';
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'روابط سريعة',
      links: [
        { label: 'الرئيسية', href: '/' },
        { label: 'العقارات', href: '/properties' },
        { label: 'المقالات', href: '/blog' },
        { label: 'من نحن', href: '/about' },
        { label: 'تواصل معنا', href: '/contact' }
      ]
    },
    {
      title: 'خدماتنا',
      links: [
        { label: 'بيع العقارات', href: '/services/sale' },
        { label: 'تأجير العقارات', href: '/services/rent' },
        { label: 'استشارات عقارية', href: '/services/consulting' },
        { label: 'تقييم العقارات', href: '/services/valuation' },
        { label: 'إدارة الممتلكات', href: '/services/management' }
      ]
    },
    {
      title: 'أنواع العقارات',
      links: [
        { label: 'شقق', href: '/properties?type=apartment' },
        { label: 'فيلات', href: '/properties?type=villa' },
        { label: 'مكاتب', href: '/properties?type=office' },
        { label: 'محلات تجارية', href: '/properties?type=shop' },
        { label: 'أراضي', href: '/properties?type=land' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">عقاري الذكي</h3>
                <p className="text-xs text-muted-foreground">Smart Estate Finder</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              منصة عقارية متطورة تستخدم أحدث تقنيات الذكاء الاصطناعي لمساعدتك في العثور على العقار المثالي. نحن نوفر خدمات شاملة في مجال العقارات بأعلى معايير الجودة والمهنية.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+966 12 345 6789</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@smartestate.sa</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                اشترك في النشرة الإخبارية
              </h4>
              <p className="text-muted-foreground">
                احصل على آخر العروض والأخبار العقارية مباشرة في بريدك الإلكتروني
              </p>
            </div>
            <div className="flex gap-3">
              <Input 
                placeholder="بريدك الإلكتروني"
                className="flex-1"
                type="email"
              />
              <Button className="bg-gradient-primary hover:opacity-90">
                اشتراك
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} عقاري الذكي. جميع الحقوق محفوظة.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground mr-2">تابعنا:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center group"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                سياسة الخصوصية
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                الشروط والأحكام
              </a>
              <a href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Are you the admin?
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;