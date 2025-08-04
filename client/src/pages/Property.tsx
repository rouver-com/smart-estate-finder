import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  ArrowUp,
  Loader2
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// تهيئة Supabase client
const supabaseUrl = 'https://stlgntcqzzgdsztjzwub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bGdudGNxenpnZHN6dGp6d3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTk5MzEsImV4cCI6MjA2OTc5NTkzMX0.EX_BYtg8Rwpmi9EH0qh3x1OsNJwDRTFVGiTm4MQgB1g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Property = () => {
  const [match, params] = useRoute('/property/:id');
  const [location, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  // جلب بيانات العقار من Supabase
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', params?.id)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error('العقار غير موجود');
        }

        // تحويل البيانات إلى الشكل المطلوب
        const formattedData = {
          ...data,
          images: data.images || ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'],
          features: data.features || [],
          amenities: data.amenities || [],
          agent: {
            name: data.agent_name || 'أحمد محمد العلي',
            phone: data.agent_phone || '+966 50 123 4567',
            email: data.agent_email || 'agent@smartestate.com',
            image: data.agent_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            rating: 4.8,
            properties: 45
          }
        };

        setProperty(formattedData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchProperty();
    }
  }, [params?.id]);

  const nextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleShare = async () => {
    if (isSharing || !property) return;

    setIsSharing(true);
    try {
      await navigator.share({
        title: property.title || 'عقار للبيع',
        text: property.description || 'عقار مميز للبيع',
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('تم نسخ رابط العقار إلى الحافظة');
        } catch (err) {
          prompt('اضغط Ctrl+C لنسخ الرابط:', window.location.href);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  const getFeatureIcon = (featureName: string | null | undefined) => {
    if (!featureName) return CheckCircle;

    const lowerFeature = featureName.toLowerCase();
    if (lowerFeature.includes('إنترنت') || lowerFeature.includes('واي فاي')) return Wifi;
    if (lowerFeature.includes('مطبخ')) return Coffee;
    if (lowerFeature.includes('رياضية') || lowerFeature.includes('جيم')) return Dumbbell;
    if (lowerFeature.includes('حديقة')) return TreePine;
    if (lowerFeature.includes('أمن')) return Shield;
    if (lowerFeature.includes('مصعد')) return ArrowUp;
    if (lowerFeature.includes('موقف')) return Car;
    if (lowerFeature.includes('مسبح')) return Square;
    return CheckCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل تفاصيل العقار...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">حدث خطأ</h2>
            <p className="text-muted-foreground mb-4">{error || 'لم يتم العثور على العقار المطلوب'}</p>
            <Button onClick={() => setLocation('/properties')}>
              العودة للعقارات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="bg-card border-b border-border sticky top-20 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/properties')}
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
                onClick={handleShare}
                disabled={isSharing}
              >
                {isSharing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
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
                  alt={property.title || 'عقار'}
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/90">
                    {property.price_type || 'للبيع'}
                  </Badge>
                  {property.is_featured && (
                    <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      مميز
                    </Badge>
                  )}
                </div>

                {/* Navigation Arrows */}
                {property.images?.length > 1 && (
                  <>
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
                  </>
                )}

                {/* Image Indicators */}
                {property.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-primary w-4' 
                            : 'bg-background/60 hover:bg-background/80'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{property.title || 'عقار بدون عنوان'}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{property.location || 'موقع غير محدد'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span>{property.bedrooms || 0} غرف نوم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <span>{property.bathrooms || 0} حمامات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span>{property.parking || 0} مواقف</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-primary" />
                      <span>{property.area || 0} م²</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">وصف العقار</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description || 'لا يوجد وصف متاح لهذا العقار.'}
                    </p>
                  </div>

                  <Separator />

                  {property.features?.length > 0 && (
                    <>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">المميزات الرئيسية</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {property.features.map((feature, index) => {
                            const IconComponent = getFeatureIcon(feature);
                            return (
                              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                <IconComponent className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">{feature || 'ميزة'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {property.amenities?.length > 0 && (
                    <>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">المرافق الإضافية</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-sm hover:bg-muted">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {amenity || 'مرافق'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="text-2xl font-bold text-primary">
                        {property.build_year || 'غير محدد'}
                      </div>
                      <div className="text-sm text-muted-foreground">سنة البناء</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="text-2xl font-bold text-primary">
                        {property.floor_number || property.property_type || 'غير محدد'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {property.floor_number ? 'رقم الطابق' : 'نوع العقار'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="text-2xl font-bold text-primary">
                        {property.bedrooms || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">غرف النوم</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="text-2xl font-bold text-primary">
                        {property.area || 0} م²
                      </div>
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
                      {property.price ? Number(property.price).toLocaleString('ar-EG') : 'غير محدد'} جنيه
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
                        src={property.agent?.image} 
                        alt={property.agent?.name}
                        className="w-12 h-12 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{property.agent?.name || 'وكيل غير معروف'}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{property.agent?.rating || 0}</span>
                          <span>•</span>
                          <span>{property.agent?.properties || 0} عقار</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white" 
                      size="lg"
                      asChild
                    >
                      <a href={`tel:${property.agent?.phone?.replace(/\D/g, '') || ''}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        اتصال مباشر
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      asChild
                    >
                      <a href={`mailto:${property.agent?.email || ''}?subject=استفسار عن عقار: ${property.title || ''}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        إرسال رسالة
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        alert('سيتم توجيهك إلى صفحة حجز الموعد');
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      حجز موعد معاينة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Properties (Placeholder) */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">عقارات مشابهة</h3>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>سيتم عرض عقارات مشابهة هنا</p>
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