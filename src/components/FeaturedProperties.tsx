import React from 'react';
import { MapPin, Bed, Bath, Car, Heart, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: string;
  image: string;
  featured: boolean;
  dateAdded: string;
}

const FeaturedProperties = () => {
  // Sample data - in real app, this would come from API
  const properties: Property[] = [
    {
      id: 1,
      title: 'شقة فاخرة في وسط المدينة',
      location: 'الرياض، حي النخيل',
      price: '850,000',
      type: 'sale',
      propertyType: 'شقة',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      area: '180',
      image: '/placeholder.svg',
      featured: true,
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      title: 'فيلا عصرية مع حديقة خاصة',
      location: 'جدة، حي الشاطئ',
      price: '4,500',
      type: 'rent',
      propertyType: 'فيلا',
      bedrooms: 5,
      bathrooms: 4,
      parking: 3,
      area: '350',
      image: '/placeholder.svg',
      featured: true,
      dateAdded: '2024-01-12'
    },
    {
      id: 3,
      title: 'مكتب تجاري في برج حديث',
      location: 'الدمام، الحي التجاري',
      price: '12,000',
      type: 'rent',
      propertyType: 'مكتب',
      bedrooms: 0,
      bathrooms: 2,
      parking: 4,
      area: '120',
      image: '/placeholder.svg',
      featured: false,
      dateAdded: '2024-01-10'
    },
    {
      id: 4,
      title: 'شقة بإطلالة بحرية رائعة',
      location: 'جدة، الكورنيش',
      price: '1,200,000',
      type: 'sale',
      propertyType: 'شقة',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      area: '220',
      image: '/placeholder.svg',
      featured: true,
      dateAdded: '2024-01-08'
    }
  ];

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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="group hover:shadow-strong transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-t-lg">
                {/* Property Image */}
                <div className="aspect-[4/3] bg-muted relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge 
                      variant={property.type === 'sale' ? 'default' : 'secondary'}
                      className="bg-gradient-primary text-primary-foreground"
                    >
                      {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
                    </Badge>
                    {property.featured && (
                      <Badge variant="secondary" className="bg-gradient-secondary text-secondary-foreground">
                        مميز
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Heart className="h-4 w-4 text-white" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Eye className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Price */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-foreground">
                      {property.price.toLocaleString()} 
                      <span className="text-sm text-muted-foreground font-normal mr-1">
                        {property.type === 'sale' ? 'ريال' : 'ريال/شهر'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>{property.parking}</span>
                    </div>
                    <div className="text-xs">
                      {property.area} م²
                    </div>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>أضيف في {new Date(property.dateAdded).toLocaleDateString('ar-SA')}</span>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full bg-gradient-primary hover:opacity-90" size="sm">
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            عرض جميع العقارات
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;