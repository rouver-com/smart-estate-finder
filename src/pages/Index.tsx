import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import ServicesSection from '@/components/ServicesSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';
import InspireAI from '@/components/InspireAI';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <ServicesSection />
      </main>
      <Footer />
      <InspireAI />
    </div>
  );
};

export default Index;
