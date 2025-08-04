import React from 'react';
import { Search, Home, TrendingUp, Calculator, Shield, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ServicesSection = () => {
  const services = [
    {
      icon: Search,
      title: 'البحث الذكي',
      description: 'نظام بحث متطور يستخدم الذكاء الاصطناعي للعثور على العقار المثالي لك',
      color: 'text-primary'
    },
    {
      icon: Home,
      title: 'إدارة العقارات',
      description: 'خدمات شاملة لإدارة وصيانة العقارات بأعلى معايير الجودة',
      color: 'text-secondary'
    },
    {
      icon: TrendingUp,
      title: 'الاستثمار العقاري',
      description: 'استشارات متخصصة في الاستثمار العقاري وتحليل الفرص المربحة',
      color: 'text-accent'
    },
    {
      icon: Calculator,
      title: 'تقييم العقارات',
      description: 'تقييم دقيق للعقارات بناءً على بيانات السوق وخبرة المتخصصين',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'الأمان والثقة',
      description: 'معاملات آمنة ومضمونة مع حماية كاملة لبيانات العملاء',
      color: 'text-secondary'
    },
    {
      icon: Headphones,
      title: 'الدعم الفني',
      description: 'فريق دعم متاح على مدار الساعة لمساعدتك في جميع استفساراتك',
      color: 'text-accent'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">خدماتنا المتميزة</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات العقارية المتطورة لضمان تجربة استثنائية
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-strong transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardContent className="p-6 text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;