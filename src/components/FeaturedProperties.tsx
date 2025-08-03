import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Car, Heart, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }
      
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">العقارات المميزة</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة مختارة من أفضل العقارات المتاحة في السوق
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Properties Grid - Bayut Style */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Card 
                key={property.id} 
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = `/property/${property.id}`}
              >
                {/* Property Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={property.images?.[0] || '/placeholder.svg'} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="secondary"
                      className={`${
                        property.price_type === 'للبيع' 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white border-0 font-medium`}
                    >
                      {property.price_type}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {property.is_featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 font-medium">
                        مميز
                      </Badge>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white border-0 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white border-0 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.share?.({
                          title: property.title,
                          url: `/property/${property.id}`
                        });
                      }}
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Property Details */}
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Number(property.price).toLocaleString('ar-EG')}
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mr-1">
                        {property.price_type === 'للبيع' ? 'جنيه' : 'جنيه/شهر'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.parking > 0 && (
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>{property.parking}</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="text-sm">
                        {property.area} م²
                      </div>
                    )}
                  </div>

                  {/* Property Type */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {property.property_type}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white border-0 rounded-xl h-11 font-medium transition-all duration-300" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/property/${property.id}`;
                    }}
                  >
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => window.location.href = '/properties'}
          >
            عرض جميع العقارات
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;