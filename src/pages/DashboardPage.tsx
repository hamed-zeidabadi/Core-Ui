import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { mockUsers, mockPayments } from '@/data/mockData';

export function DashboardPage() {
  // Calculate statistics
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const totalPayments = mockPayments.length;
  const completedPayments = mockPayments.filter(payment => payment.status === 'completed').length;
  const totalRevenue = mockPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    {
      title: 'کل کاربران',
      value: totalUsers.toLocaleString('fa-IR'),
      description: `${activeUsers} کاربر فعال`,
      icon: Users,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'درآمد کل',
      value: `${totalRevenue.toLocaleString('fa-IR')} تومان`,
      description: 'درآمد این ماه',
      icon: DollarSign,
      trend: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'پرداخت‌ها',
      value: totalPayments.toLocaleString('fa-IR'),
      description: `${completedPayments} موفق`,
      icon: CreditCard,
      trend: '+15%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'نرخ تبدیل',
      value: '68%',
      description: 'افزایش نسبت به ماه قبل',
      icon: TrendingUp,
      trend: '+3%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_register',
      message: 'سارا نجفی ثبت نام کرد',
      time: '۵ دقیقه پیش',
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'payment_completed',
      message: 'پرداخت ۲۵۰,۰۰۰ تومانی تکمیل شد',
      time: '۱۵ دقیقه پیش',
      icon: CreditCard,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'payment_failed',
      message: 'پرداخت ناموفق برای مریم جوادی',
      time: '۳۰ دقیقه پیش',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      id: 4,
      type: 'user_login',
      message: 'علی احمدی وارد سیستم شد',
      time: '۱ ساعت پیش',
      icon: Activity,
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">داشبورد</h1>
        <p className="text-muted-foreground">
          نمای کلی از عملکرد سیستم و آمار مهم
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              فعالیت‌های اخیر
            </CardTitle>
            <CardDescription>
              آخرین رویدادهای سیستم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              آمار سریع
            </CardTitle>
            <CardDescription>
              عملکرد این ماه
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">کاربران فعال</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((activeUsers / totalUsers) * 100)}%
                </span>
              </div>
              <Progress value={(activeUsers / totalUsers) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">پرداخت‌های موفق</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((completedPayments / totalPayments) * 100)}%
                </span>
              </div>
              <Progress value={(completedPayments / totalPayments) * 100} className="h-2" />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">هدف ماهانه</span>
                <span className="font-medium">۵,۰۰۰,۰۰۰ تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">تحقق یافته</span>
                <span className="font-medium text-green-600">
                  {totalRevenue.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}