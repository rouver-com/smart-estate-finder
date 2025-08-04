import { useState, useEffect, useCallback } from 'react';
import { MapPin, Bed, Bath, Car, Heart, Eye, Share2, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';
import type { Property } from '@shared/schema';

// تهيئة Supabase client
const supabaseUrl = 'https://stlgntcqzzgdsztjzwub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bGdudGNxenpnZHN6dGp6d3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTk5MzEsImV4cCI6MjA2OTc5NTkzMX0.EX_BYtg8Rwpmi9EH0qh3x1OsNJwDRTFVGiTm4MQgB1g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FeaturedProperties = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    propertyType: 'all',
    priceType: 'all'
  });
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 8;

  // جلب البيانات من Supabase
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // حساب الإزاحة (offset) للتجزئة
      const offset = (page - 1) * itemsPerPage;

      // بناء الاستعلام مع التصفية
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

      // تطبيق التصفية حسب النوع
      if (filters.propertyType !== 'all') {
        query = query.eq('property_type', filters.propertyType);
      }

      // تطبيق التصفية حسب نوع السعر
      if (filters.priceType !== 'all') {
        query = query.eq('price_type', filters.priceType);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setProperties(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // تطبيق التصفية
  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setPage(1);
  };

  // حساب عدد الصفحات
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // تبديل المفضلة
  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              العقارات المميزة
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف مجموعة مختارة من أفضل العقارات المتاحة في السوق
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm">
            <Filter className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300 mr-2">تصفية:</span>
            <div className="flex gap-2">
              <Button 
                variant={filters.propertyType === 'all' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('propertyType', 'all')}
              >
                الكل
              </Button>
              <Button 
                variant={filters.propertyType === 'شقة' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('propertyType', 'شقة')}
              >
                شقق
              </Button>
              <Button 
                variant={filters.propertyType === 'فيلا' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('propertyType', 'فيلا')}
              >
                فلل
              </Button>
              <Button 
                variant={filters.propertyType === 'أرض' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('propertyType', 'أرض')}
              >
                أراضي
              </Button>
            </div>
          </div>

          <div className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm">
            <div className="flex gap-2">
              <Button 
                variant={filters.priceType === 'all' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('priceType', 'all')}
              >
                الكل
              </Button>
              <Button 
                variant={filters.priceType === 'للبيع' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('priceType', 'للبيع')}
              >
                للبيع
              </Button>
              <Button 
                variant={filters.priceType === 'للإيجار' ? 'default' : 'outline'}
                className="rounded-full"
                size="sm"
                onClick={() => handleFilterChange('priceType', 'للإيجار')}
              >
                للإيجار
              </Button>
            </div>
          </div>
        </div>

        {/* حالة التحميل */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  </div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // عرض خطأ إذا حدث مشكلة
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl p-6 max-w-lg mx-auto">
              <h3 className="font-bold text-xl mb-2">خطأ في جلب البيانات</h3>
              <p>{error}</p>
              <Button 
                className="mt-4 bg-gradient-to-r from-red-600 to-orange-500 text-white"
                onClick={fetchProperties}
              >
                حاول مرة أخرى
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* حالة عدم وجود عقارات */}
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-xl p-6 max-w-lg mx-auto">
                  <h3 className="font-bold text-xl mb-2">لا توجد عقارات متاحة</h3>
                  <p>لم نتمكن من العثور على عقارات تطابق معايير البحث الخاصة بك.</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    onClick={() => {
                      setFilters({ propertyType: 'all', priceType: 'all' });
                      setPage(1);
                    }}
                  >
                    إعادة تعيين الفلاتر
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* شبكة العقارات */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((property) => (
                    <Card 
                      key={property.id} 
                      className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
                      {/* صورة العقار */}
                      <div 
                        className="relative aspect-video overflow-hidden"
                        onClick={() => window.location.href = `/property/${property.id}`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-gray-400 text-sm">لا توجد صورة</div>
                          )}
                        </div>

                        {/* طبقة تدرج لوني */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* بادج حالة العقار */}
                        <div className="absolute top-4 left-4">
                          <Badge 
                            className={`${
                              property.priceType === 'للبيع' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                            } text-white border-0 font-medium rounded-lg`}
                          >
                            {property.priceType}
                          </Badge>
                        </div>

                        {/* بادج مميز */}
                        {property.isFeatured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 font-medium rounded-lg">
                              مميز
                            </Badge>
                          </div>
                        )}

                        {/* أزرار الإجراءات */}
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 hover:bg-white border-0 shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(property.id);
                            }}
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 hover:bg-white border-0 shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.share?.({
                                title: property.title,
                                text: property.description || '',
                                url: `/property/${property.id}`
                              });
                            }}
                          >
                            <Share2 className="h-5 w-5 text-gray-600" />
                          </Button>
                        </div>
                      </div>

                      {/* تفاصيل العقار */}
                      <CardContent className="p-5">
                        {/* السعر */}
                        <div className="mb-3 flex justify-between items-center">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {Number(property.price).toLocaleString('ar-EG')}
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mr-1">
                              {property.priceType === 'للبيع' ? 'جنيه' : 'جنيه/شهر'}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(property.createdAt || new Date()).toLocaleDateString('ar-EG')}
                          </div>
                        </div>

                        {/* العنوان */}
                        <h3 
                          className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 text-lg"
                          onClick={() => window.location.href = `/property/${property.id}`}
                        >
                          {property.title}
                        </h3>

                        {/* الموقع */}
                        <div 
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4"
                          onClick={() => window.location.href = `/property/${property.id}`}
                        >
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{property.location}</span>
                        </div>

                        {/* مميزات العقار */}
                        <div className="flex items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4 text-blue-500" />
                            <span>{property.bedrooms} غرف</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4 text-blue-500" />
                            <span>{property.bathrooms} حمامات</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4 text-blue-500" />
                            <span>{property.parking} مواقف</span>
                          </div>
                          {property.area && (
                            <div className="text-sm font-medium">
                              {property.area} م²
                            </div>
                          )}
                        </div>

                        {/* نوع العقار */}
                        <div className="mb-4 flex justify-between items-center">
                          <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {property.propertyType}
                          </span>

                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Eye className="h-4 w-4" />
                            <span>0 مشاهدة</span>
                          </div>
                        </div>

                        {/* زر التفاصيل */}
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 rounded-xl h-11 font-medium transition-all duration-300 flex items-center justify-center" 
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
              </>
            )}
          </>
        )}

        {/* التجزئة (Pagination) */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page <= 3 
                  ? i + 1 
                  : page >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : page - 2 + i;

                if (pageNum > totalPages || pageNum < 1) return null;

                return (
                  <Button 
                    key={i}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="rounded-full w-10 h-10"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* زر عرض الكل */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 rounded-full px-8 h-14 font-medium transition-all duration-300"
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