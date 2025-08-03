import React, { useState } from 'react';
import { Search, MapPin, Building, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface SearchFilters {
  location: string;
  propertyType: 'rent' | 'buy';
  minPrice: string;
  maxPrice: string;
}

const ModernSearchBar = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: 'buy',
    minPrice: '',
    maxPrice: ''
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locations = [
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
    'العاصمة الإدارية الجديدة',
    'الشيخ زايد'
  ];

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        searchParams.set(key, value);
      }
    });
    
    const queryString = searchParams.toString();
    const targetUrl = queryString ? `/properties?${queryString}` : '/properties';
    window.location.href = targetUrl;
  };

  const priceRanges = filters.propertyType === 'rent' 
    ? [
        { label: 'أقل من 5,000 جنيه', min: '0', max: '5000' },
        { label: '5,000 - 10,000 جنيه', min: '5000', max: '10000' },
        { label: '10,000 - 20,000 جنيه', min: '10000', max: '20000' },
        { label: '20,000 - 50,000 جنيه', min: '20000', max: '50000' },
        { label: 'أكثر من 50,000 جنيه', min: '50000', max: '' }
      ]
    : [
        { label: 'أقل من مليون جنيه', min: '0', max: '1000000' },
        { label: '1 - 3 مليون جنيه', min: '1000000', max: '3000000' },
        { label: '3 - 5 مليون جنيه', min: '3000000', max: '5000000' },
        { label: '5 - 10 مليون جنيه', min: '5000000', max: '10000000' },
        { label: 'أكثر من 10 مليون جنيه', min: '10000000', max: '' }
      ];

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-card/95 backdrop-blur-lg border-0 shadow-elegant">
      <div className="space-y-6">
        {/* Type Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-muted rounded-full p-1 flex">
            <Button
              variant={filters.propertyType === 'buy' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setFilters(prev => ({ ...prev, propertyType: 'buy' }))}
            >
              للبيع
            </Button>
            <Button
              variant={filters.propertyType === 'rent' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setFilters(prev => ({ ...prev, propertyType: 'rent' }))}
            >
              للإيجار
            </Button>
          </div>
        </div>

        {/* Main Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">الموقع</span>
            </div>
            <Input
              placeholder="اختر المنطقة..."
              value={filters.location}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, location: e.target.value }));
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              className="h-12"
            />
            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-strong z-10 max-h-48 overflow-y-auto">
                {locations
                  .filter(location => 
                    filters.location === '' || 
                    location.toLowerCase().includes(filters.location.toLowerCase())
                  )
                  .map((location, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, location }));
                        setShowLocationDropdown(false);
                      }}
                    >
                      {location}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">نطاق السعر</span>
            </div>
            <Select 
              value={`${filters.minPrice}-${filters.maxPrice}`}
              onValueChange={(value) => {
                const [min, max] = value.split('-');
                setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="اختر النطاق السعري" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range, index) => (
                  <SelectItem key={index} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              onClick={handleSearch}
              className="h-12 w-full bg-gradient-primary hover:opacity-90 shadow-glow"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              بحث
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModernSearchBar;