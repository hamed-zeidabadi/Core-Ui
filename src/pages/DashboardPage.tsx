import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Calendar,
  HardDrive,
  Shield,
  Clock,
  Download
} from 'lucide-react';
import { mockUsers, mockPayments, mockBackupHistory } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  // Calculate statistics
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const totalPayments = mockPayments.length;
  const completedPayments = mockPayments.filter(payment => payment.status === 'completed').length;
  const totalRevenue = mockPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Backup statistics
  const totalBackups = mockBackupHistory.length;
  const successfulBackups = mockBackupHistory.filter(backup => backup.status === 'completed').length;
  const failedBackups = mockBackupHistory.filter(backup => backup.status === 'failed').length;
  const backupSuccessRate = totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : 0;

  const stats = [
    {
      title: 'کل کاربران',
      value: totalUsers.toLocaleString('fa-IR'),
      description: `${activeUsers} کاربر فعال`,
      icon: Users,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/dashboard/users',
    },
    {
      title: 'درآمد کل',
      value: `${totalRevenue.toLocaleString('fa-IR')} تومان`,
      description: 'درآمد این ماه',
      icon: DollarSign,
      trend: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/dashboard/payments',
    },
    {
      title: 'پشتیبان‌گیری‌ها',
      value: totalBackups.toLocaleString('fa-IR'),
      description: `${successfulBackups} موفق`,
      icon: HardDrive,
      trend: '+15%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/dashboard/files',
    },
    {
      title: 'نرخ موفقیت',
      value: `${backupSuccessRate.toFixed(1)}%`,
      description: 'پشتیبان‌گیری موفق',
      icon: TrendingUp,
      trend: '+3%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'backup_completed',
      message: 'پشتیبان‌گیری خودکار تکمیل شد',
      time: '۵ دقیقه پیش',
      icon: Shield,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'user_register',
      message: 'سارا نجفی ثبت نام کرد',
      time: '۱۵ دقیقه پیش',
      icon: UserCheck,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'payment_completed',
      message: 'پرداخت ۲۵۰,۰۰۰ تومانی تکمیل شد',
      time: '۳۰ دقیقه پیش',
      icon: CreditCard,
      color: 'text-green-600',
    },
    {
      id: 4,
      type: 'backup_failed',
      message: 'پشتیبان‌گیری ناموفق برای فایل بزرگ',
      time: '۱ ساعت پیش',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      id: 5,
      type: 'user_login',
      message: 'علی احمدی وارد سیستم شد',
      time: '۲ ساعت پیش',
      icon: Activity,
      color: 'text-gray-600',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} گیگابایت`;
    }
    return `${mb.toFixed(1)} مگابایت`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">داشبورد</h1>
        <p className="text-muted-foreground">
          نمای کلی از عملکرد سیستم پشتیبان‌گیری ابری و آمار مهم
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={stat.href || '#'}>
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
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
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                فعالیت‌های اخیر
              </CardTitle>
              <CardDescription>
                آخرین رویدادهای سیستم پشتیبان‌گیری
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: activity.id * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats & Recent Backups */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
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
                    <span className="text-sm font-medium">پشتیبان‌گیری موفق</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(backupSuccessRate)}%
                    </span>
                  </div>
                  <Progress value={backupSuccessRate} className="h-2" />
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
          </motion.div>

          {/* Recent Backups */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  پشتیبان‌گیری‌های اخیر
                </CardTitle>
                <CardDescription>
                  آخرین فعالیت‌های پشتیبان‌گیری
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBackupHistory.slice(0, 4).map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          backup.status === 'completed' ? 'bg-green-500' :
                          backup.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="font-medium truncate max-w-[120px]">
                          {backup.fileName}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(backup.fileSize)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(backup.backupDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-2" asChild>
                  <Link to="/dashboard/files">
                    <Download className="h-4 w-4" />
                    مشاهده همه
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}