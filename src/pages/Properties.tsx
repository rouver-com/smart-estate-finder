import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Heart,
  Share2,
  Eye,
  ArrowLeft,
  Filter,
  Grid,
  List
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/integrations/supabase/client';

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }
      
      // Transform data to match UI format
      const transformedData = data?.map(property => ({
        id: property.id,
        title: property.title,
        location: property.location,
        price: `${property.price.toLocaleString()} جنيه${property.price_type === 'للإيجار' ? '/شهر' : ''}`,
        type: property.price_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parking: property.parking,
        area: property.area ? `${property.area} م²` : '',
        image: property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        features: property.features || [],
        description: property.description
      })) || [];
      
      setProperties(transformedData);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للرئيسية
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">العقارات المتاحة</h1>
          <p className="text-muted-foreground">تصفح أفضل العقارات في مصر</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </div>

      {/* Filters & View Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              فلترة النتائج
            </Button>
            <span className="text-muted-foreground">{properties.length} عقار متاح</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-strong transition-all duration-300 border-0 bg-card/95 backdrop-blur-lg">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {property.type}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-background"
                    onClick={() => toggleFavorite(property.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(property.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-background"
                  >
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      {property.parking}
                    </div>
                    <span>{property.area}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">
                      {property.price}
                    </div>
                    <Button 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => window.location.href = `/property/${property.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      تفاصيل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;