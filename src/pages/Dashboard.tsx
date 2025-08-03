import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Home, label: 'إجمالي العقارات', value: '10,247', change: '+12%', color: 'text-blue-600' },
    { icon: Users, label: 'العملاء المسجلين', value: '5,683', change: '+8%', color: 'text-green-600' },
    { icon: TrendingUp, label: 'الصفقات المكتملة', value: '3,529', change: '+23%', color: 'text-purple-600' },
    { icon: DollarSign, label: 'إجمالي المبيعات', value: '2.4M SAR', change: '+15%', color: 'text-yellow-600' }
  ];

  const recentProperties = [
    { id: 1, title: 'فيلا فاخرة في الرياض', type: 'للبيع', price: '2,500,000 SAR', status: 'متاح' },
    { id: 2, title: 'شقة حديثة في جدة', type: 'للإيجار', price: '4,000 SAR/شهر', status: 'مؤجر' },
    { id: 3, title: 'مكتب تجاري في الدمام', type: 'للبيع', price: '850,000 SAR', status: 'متاح' },
    { id: 4, title: 'أرض استثمارية في الخبر', type: 'للبيع', price: '1,200,000 SAR', status: 'محجوز' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة إدارة العقارات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-strong bg-card/95 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-glass backdrop-blur-sm border border-primary/20 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-strong bg-card/95 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              إضافة عقار جديد
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              إدارة العملاء
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              التقارير والإحصائيات
            </Button>
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card className="lg:col-span-2 border-0 shadow-strong bg-card/95 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>العقارات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{property.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">{property.type}</span>
                      <span className="text-sm font-medium text-primary">{property.price}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.status === 'متاح' ? 'bg-green-100 text-green-700' :
                        property.status === 'مؤجر' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;