import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  BarChart3,
  MessageSquare,
  Calendar,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: recentProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  const { data: recentInquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ['/api/inquiries'],
  });

  const loading = statsLoading || propertiesLoading || inquiriesLoading;

  const statsData = [
    { 
      icon: Home, 
      label: 'إجمالي العقارات', 
      value: stats?.totalProperties?.toString() || '0', 
      change: '+12%', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      icon: MessageSquare, 
      label: 'استفسارات العملاء', 
      value: stats?.totalInquiries?.toString() || '0', 
      change: '+8%', 
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    { 
      icon: Users, 
      label: 'محادثات AI', 
      value: stats?.totalConversations?.toString() || '0', 
      change: '+23%', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    { 
      icon: TrendingUp, 
      label: 'العقارات المميزة', 
      value: stats?.featuredProperties?.toString() || '0', 
      change: '+15%', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-48" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-8 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">لوحة التحكم</h1>
        <p className="text-gray-600 dark:text-gray-400">مرحباً بك في لوحة إدارة عقاري الذكي</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus className="h-5 w-5" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-primary hover:opacity-90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              إضافة عقار جديد
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Users className="h-4 w-4 mr-2" />
              إدارة الاستفسارات
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <BarChart3 className="h-4 w-4 mr-2" />
              التقارير والإحصائيات
            </Button>
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">العقارات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.length > 0 ? (
                recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{property.title}</h4>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {property.price_type}
                        </Badge>
                        <span className="text-sm font-medium text-primary">
                          {Number(property.price).toLocaleString('ar-EG')} جنيه
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">لا توجد عقارات حتى الآن</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">الاستفسارات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{inquiry.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{inquiry.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{inquiry.email}</span>
                        <span>{inquiry.phone}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(inquiry.created_at).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        رد
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">لا توجد استفسارات حتى الآن</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;