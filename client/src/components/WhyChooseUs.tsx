import React from 'react';
import { CheckCircle, Star, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhyChooseUs = () => {
  const benefits = [
    'أكثر من 15 سنة خبرة في السوق العقاري',
    'شبكة واسعة من العقارات المتميزة',
    'فريق متخصص من الخبراء العقاريين',
    'تقنيات الذكاء الاصطناعي للبحث الدقيق',
    'خدمة عملاء متاحة 24/7',
    'ضمان أفضل الأسعار في السوق'
  ];

  const achievements = [
    { icon: Users, value: '5000+', label: 'عميل راضي' },
    { icon: Star, value: '4.9', label: 'تقييم العملاء' },
    { icon: CheckCircle, value: '3500+', label: 'صفقة مكتملة' },
    { icon: Clock, value: '24/7', label: 'دعم فني' }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              لماذا تختار <span className="bg-gradient-primary bg-clip-text text-transparent">عقاري الذكي</span>؟
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              نحن لسنا مجرد منصة عقارية، بل شريكك المثالي في رحلة البحث عن العقار المناسب. 
              نجمع بين الخبرة التقليدية وأحدث التقنيات لنقدم لك خدمة لا مثيل لها.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-secondary hover:opacity-90 text-secondary-foreground">
              تعرف على المزيد
            </Button>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <achievement.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;