import { useState, useEffect } from 'react';
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
  List,
  ChevronDown
} from 'lucide-react';
import ModernSearchBar from '@/components/ModernSearchBar';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';

// تهيئة Supabase
const supabaseUrl = 'https://stlgntcqzzgdsztjzwub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bGdudGNxenpnZHN6dGp6d3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTk5MzEsImV4cCI6MjA2OTc5NTkzMX0.EX_BYtg8Rwpmi9EH0qh3x1OsNJwDRTFVGiTm4MQgB1g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('الكل');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('الكل');
  const [priceTypes, setPriceTypes] = useState<string[]>([]);
  const [selectedPriceType, setSelectedPriceType] = useState<string>('الكل');

  // جلب البيانات من Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        // بناء الاستعلام مع التصفية
        let query = supabase
          .from('properties')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // تطبيق الفلاتر
        if (selectedLocation !== 'الكل') {
          query = query.eq('location', selectedLocation);
        }

        if (selectedPropertyType !== 'الكل') {
          query = query.eq('property_type', selectedPropertyType);
        }

        if (selectedPriceType !== 'الكل') {
          query = query.eq('price_type', selectedPriceType);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        setProperties(data || []);

        // جلب القيم الفريدة للفلاتر
        fetchFilterOptions();
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        // جلب المواقع الفريدة
        const { data: locationsData } = await supabase
          .from('properties')
          .select('location')
          .neq('location', null);

        const uniqueLocations = Array.from(new Set(locationsData?.map(p => p.location) || []));
        setLocations(['الكل', ...uniqueLocations]);

        // جلب أنواع العقارات الفريدة
        const { data: typesData } = await supabase
          .from('properties')
          .select('property_type')
          .neq('property_type', null);

        const uniqueTypes = Array.from(new Set(typesData?.map(p => p.property_type) || []));
        setPropertyTypes(['الكل', ...uniqueTypes]);

        // جلب أنواع الأسعار الفريدة
        const { data: priceTypesData } = await supabase
          .from('properties')
          .select('price_type')
          .neq('price_type', null);

        const uniquePriceTypes = Array.from(new Set(priceTypesData?.map(p => p.price_type) || []));
        setPriceTypes(['الكل', ...uniquePriceTypes]);

      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchProperties();
  }, [selectedLocation, selectedPropertyType, selectedPriceType]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // تحويل البيانات لتتناسب مع الواجهة
  const transformedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: `${Number(property.price).toLocaleString('ar-EG')} جنيه${property.price_type === 'للإيجار' ? '/شهر' : ''}`,
    type: property.price_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parking: property.parking,
    area: property.area ? `${property.area} م²` : '',
    image: property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    features: property.features || [],
    description: property.description,
    is_featured: property.is_featured
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Header */}
      <div className="bg-card border-b border-border pt-20">
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
          <ModernSearchBar />
        </div>
      </div>

      {/* Filters & View Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* فلتر الموقع */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none bg-background border border-input rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            {/* فلتر نوع العقار */}
            <div className="relative">
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="appearance-none bg-background border border-input rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            {/* فلتر نوع السعر */}
            <div className="relative">
              <select
                value={selectedPriceType}
                onChange={(e) => setSelectedPriceType(e.target.value)}
                className="appearance-none bg-background border border-input rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {priceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            <span className="text-muted-foreground">
              {properties.length} عقار متاح
            </span>
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

        {/* حالة التحميل */}
        {loading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 bg-card/95 backdrop-blur-lg animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* حالة الخطأ */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl p-6 max-w-lg mx-auto">
              <h3 className="font-bold text-xl mb-2">خطأ في جلب البيانات</h3>
              <p className="mb-4">{error}</p>
              <Button 
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white"
                onClick={() => window.location.reload()}
              >
                حاول مرة أخرى
              </Button>
            </div>
          </div>
        )}

        {/* عرض العقارات */}
        {!loading && !error && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {transformedProperties.map((property) => (
              <Card 
                key={property.id} 
                className="overflow-hidden hover:shadow-strong transition-all duration-300 border-0 bg-card/95 backdrop-blur-lg cursor-pointer max-h-[75vh]"
                onClick={() => window.location.href = `/property/${property.id}`}
              >
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {property.is_featured && (
                      <Badge variant="secondary" className="bg-amber-500 text-white">
                        مميز
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {property.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full bg-background/90 hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.share?.({
                          title: property.title,
                          text: property.description,
                          url: `/property/${property.id}`
                        });
                      }}
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
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/property/${property.id}`;
                        }}
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
        )}

        {/* حالة عدم وجود عقارات */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-xl p-6 max-w-lg mx-auto">
              <h3 className="font-bold text-xl mb-2">لا توجد عقارات متاحة</h3>
              <p className="mb-4">لم نتمكن من العثور على عقارات تطابق معايير البحث الخاصة بك.</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                onClick={() => {
                  setSelectedLocation('الكل');
                  setSelectedPropertyType('الكل');
                  setSelectedPriceType('الكل');
                }}
              >
                عرض جميع العقارات
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;