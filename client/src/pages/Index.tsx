import React from 'react';
import Header from '@/components/Header';
import FeaturedProperties from '@/components/FeaturedProperties';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-16 pt-20">
        <FeaturedProperties />
        <ServicesSection />
      </main>
      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;
