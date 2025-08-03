import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, Bath, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SearchFilters {
  type: string;
  location: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  features: string[];
}

const SearchBar = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    type: '',
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    features: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    // Navigate to properties page with filters
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (typeof value === 'string' || Array.isArray(value))) {
        searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    window.location.href = `/properties?${searchParams.toString()}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Search Bar */}
      <div className="bg-card/95 backdrop-blur-lg rounded-2xl shadow-strong border border-border/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">نوع العملية</label>
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="بيع أو إيجار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">للبيع</SelectItem>
                <SelectItem value="rent">للإيجار</SelectItem>
                <SelectItem value="both">كلاهما</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location - Enhanced */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-lg font-semibold text-foreground">الموقع</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                placeholder="ابحث عن المدينة، المنطقة أو الحي..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="h-14 pl-12 text-lg bg-background border-2 border-primary/20 focus:border-primary shadow-md"
              />
              {filters.location && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-strong z-10 max-h-48 overflow-y-auto">
                  {[
                    'القاهرة - مدينة نصر', 
                    'القاهرة - الزمالك', 
                    'القاهرة - المعادي', 
                    'القاهرة - التجمع الخامس',
                    'الجيزة - المهندسين', 
                    'الجيزة - الدقي', 
                    'الجيزة - 6 أكتوبر',
                    'الإسكندرية - سيدي جابر',
                    'الإسكندرية - سموحة',
                    'الإسكندرية - العجمي',
                    'الإسكندرية - برج العرب',
                    'الغردقة - سهل حشيش',
                    'شرم الشيخ - نبق',
                    'العاصمة الإدارية الجديدة',
                    'الشيخ زايد'
                  ]
                    .filter(location => location.toLowerCase().includes(filters.location.toLowerCase()))
                    .map((location, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 flex items-center gap-2"
                        onClick={() => setFilters(prev => ({ ...prev, location }))}
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{location}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">نوع العقار</label>
            <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="شقة، فيلا، مكتب..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">شقة</SelectItem>
                <SelectItem value="villa">فيلا</SelectItem>
                <SelectItem value="office">مكتب</SelectItem>
                <SelectItem value="shop">محل تجاري</SelectItem>
                <SelectItem value="land">أرض</SelectItem>
                <SelectItem value="warehouse">مستودع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">نطاق السعر</label>
            <div className="flex gap-2">
              <Input
                placeholder="أقل سعر (جنيه)"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="h-12"
                type="number"
              />
              <Input
                placeholder="أعلى سعر (جنيه)"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="h-12"
                type="number"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">عدد الغرف</label>
            <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="غرف النوم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 غرفة</SelectItem>
                <SelectItem value="2">2 غرفة</SelectItem>
                <SelectItem value="3">3 غرف</SelectItem>
                <SelectItem value="4">4 غرف</SelectItem>
                <SelectItem value="5+">5+ غرف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground opacity-0">بحث</label>
            <Button 
              onClick={handleSearch}
              className="h-12 w-full bg-gradient-primary hover:opacity-90 shadow-glow transition-all duration-300"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              بحث
            </Button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {showAdvanced ? 'إخفاء الفلاتر المتقدمة' : 'عرض الفلاتر المتقدمة'}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">عدد الحمامات</label>
              <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="الحمامات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 حمام</SelectItem>
                  <SelectItem value="2">2 حمام</SelectItem>
                  <SelectItem value="3">3 حمامات</SelectItem>
                  <SelectItem value="4+">4+ حمامات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-muted-foreground">المميزات الإضافية</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'مسبح',
                  'موقف سيارات',
                  'حديقة',
                  'شرفة',
                  'مصعد',
                  'أمن 24/7',
                  'جيم',
                  'مفروش',
                  'إطلالة بحر',
                  'قريب من المدرسة'
                ].map((feature) => (
                  <Badge
                    key={feature}
                    variant={filters.features.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;