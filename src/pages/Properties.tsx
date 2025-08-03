import React, { useState } from 'react';
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

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);

  const properties = [
    {
      id: 1,
      title: 'فيلا فاخرة مع مسبح خاص',
      location: 'القاهرة - مدينة نصر',
      price: '15,000,000 جنيه',
      type: 'للبيع',
      bedrooms: 5,
      bathrooms: 4,
      parking: 3,
      area: '450 م²',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      features: ['مسبح', 'حديقة', 'مفروش'],
      description: 'فيلا راقية في موقع متميز بمدينة نصر مع تشطيبات عالية الجودة'
    },
    {
      id: 2,
      title: 'شقة حديثة بإطلالة رائعة',
      location: 'الإسكندرية - سموحة',
      price: '25,000 جنيه/شهر',
      type: 'للإيجار',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      area: '180 م²',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      features: ['شرفة', 'مصعد', 'أمن 24/7'],
      description: 'شقة عصرية في برج راقي مع جميع الخدمات'
    },
    {
      id: 3,
      title: 'شقة فاخرة في التجمع الخامس',
      location: 'القاهرة - التجمع الخامس',
      price: '3,200,000 جنيه',
      type: 'للبيع',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      area: '220 م²',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      features: ['شرفة', 'مفروش', 'أمن 24/7'],
      description: 'شقة عصرية في كمبوند راقي بالتجمع الخامس'
    },
    {
      id: 4,
      title: 'فيلا مع حديقة في الشيخ زايد',
      location: 'الجيزة - الشيخ زايد',
      price: '8,500,000 جنيه',
      type: 'للبيع',
      bedrooms: 6,
      bathrooms: 5,
      parking: 4,
      area: '520 م²',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      features: ['مسبح', 'حديقة', 'جيم'],
      description: 'فيلا متميزة في موقع هادئ بالشيخ زايد'
    },
    {
      id: 5,
      title: 'شقة للإيجار في الزمالك',
      location: 'القاهرة - الزمالك',
      price: '15,000 جنيه/شهر',
      type: 'للإيجار',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      area: '140 م²',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      features: ['إطلالة نيل', 'مفروش', 'مصعد'],
      description: 'شقة أنيقة بإطلالة رائعة على النيل'
    },
    {
      id: 6,
      title: 'مكتب تجاري في العاصمة الإدارية',
      location: 'العاصمة الإدارية الجديدة',
      price: '45,000 جنيه/شهر',
      type: 'للإيجار',
      bedrooms: 0,
      bathrooms: 2,
      parking: 3,
      area: '300 م²',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      features: ['أمن 24/7', 'مصعد', 'موقف مخصص'],
      description: 'مكتب حديث في برج تجاري متميز'
    }
  ];

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