import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Square,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  Star,
  CheckCircle,
  Wifi,
  Coffee,
  Dumbbell,
  TreePine,
  Shield,
  ArrowUp
} from 'lucide-react';

const Property = () => {
  const [match, params] = useRoute('/property/:id');
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const id = params?.id;

  const { data: property, isLoading: loading, error } = useQuery({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });

  if (error) {
    setLocation('/properties');
    return null;
  }

  const propertyData = property ? {
    ...property,
    images: property.images || ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'],
    features: property.features || [],
    amenities: property.amenities || [],
    agent: {
      name: property.agentName || 'أحمد محمد العلي',
      phone: property.agentPhone || '+966 50 123 4567',
      email: property.agentEmail || 'agent@smartestate.com',
      image: property.agentImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 4.8,
      properties: 45
    }
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل تفاصيل العقار...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">العقار غير موجود</h2>
            <p className="text-muted-foreground mb-4">لم يتم العثور على العقار المطلوب</p>
            <Button onClick={() => setLocation('/properties')}>
              العودة للعقارات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Header */}
      <div className="bg-card border-b border-border sticky top-20 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/properties')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للعقارات
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => {
                  navigator.share({
                    title: property.title,
                    url: window.location.href
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Could add toast notification here
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
                مشاركة
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/90">
                    {property.price_type}
                  </Badge>
                </div>
                
                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span>{property.bedrooms} غرف نوم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <span>{property.bathrooms} حمامات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span>{property.parking} مواقف</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-primary" />
                      <span>{property.area}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">وصف العقار</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">المميزات الرئيسية</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.features && property.features.map((feature, index) => {
                        // Feature icon mapping
                        const getFeatureIcon = (featureName: string) => {
                          const lowerFeature = featureName.toLowerCase();
                          if (lowerFeature.includes('إنترنت') || lowerFeature.includes('واي فاي')) return Wifi;
                          if (lowerFeature.includes('مطبخ')) return Coffee;
                          if (lowerFeature.includes('رياضية') || lowerFeature.includes('جيم')) return Dumbbell;
                          if (lowerFeature.includes('حديقة')) return TreePine;
                          if (lowerFeature.includes('أمن')) return Shield;
                          if (lowerFeature.includes('مصعد')) return ArrowUp;
                          if (lowerFeature.includes('موقف')) return Car;
                          if (lowerFeature.includes('مسبح')) return Square;
                          return CheckCircle; // Default icon
                        };
                        
                        const IconComponent = getFeatureIcon(feature);
                        
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">المرافق الإضافية</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">{property.build_year || 'غير محدد'}</div>
                      <div className="text-sm text-muted-foreground">سنة البناء</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">{property.floor_number || property.property_type}</div>
                      <div className="text-sm text-muted-foreground">نوع العقار</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">غرف النوم</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">{property.area} م²</div>
                      <div className="text-sm text-muted-foreground">المساحة</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {property.price?.toLocaleString()} جنيه
                    </div>
                    {property.price_type === 'للإيجار' && (
                      <div className="text-lg text-muted-foreground">شهرياً</div>
                    )}
                  </div>

                  <Separator />

                  {/* Agent Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">الوكيل العقاري</h3>
                    <div className="flex items-center gap-3">
                      <img 
                        src={property.agent.image} 
                        alt={property.agent.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{property.agent.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{property.agent.rating}</span>
                          <span>•</span>
                          <span>{property.agent.properties} عقار</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      اتصال مباشر
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      إرسال رسالة
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      حجز موعد معاينة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;