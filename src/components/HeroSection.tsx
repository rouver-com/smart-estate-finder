import React from 'react';
import { TrendingUp, Home, Users, Award } from 'lucide-react';
import SearchBar from './SearchBar';
import heroImage from '@/assets/hero-real-estate.jpg';

const HeroSection = () => {
  const stats = [
    { icon: Home, label: 'عقار متاح', value: '10,000+' },
    { icon: Users, label: 'عميل راضي', value: '5,000+' },
    { icon: TrendingUp, label: 'صفقة مكتملة', value: '3,500+' },
    { icon: Award, label: 'سنة خبرة', value: '15+' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              اكتشف منزل
            </span>
            <br />
            <span className="text-foreground">أحلامك</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            ابحث عن العقار المثالي من خلال أحدث تقنيات الذكاء الاصطناعي. آلاف العقارات في انتظارك
          </p>

          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-glass backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">مدعوم بالذكاء الاصطناعي</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-16">
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-glass backdrop-blur-sm border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-pulse delay-500" />
    </section>
  );
};

export default HeroSection;