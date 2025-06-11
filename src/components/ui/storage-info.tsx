import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Files, Folder, TrendingUp } from 'lucide-react';
import { storageStats } from '@/data/mockFileData';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function StorageInfo() {
  const usagePercentage = (storageStats.usedStorage / storageStats.totalStorage) * 100;
  
  const stats = [
    {
      title: 'فضای استفاده شده',
      value: formatFileSize(storageStats.usedStorage),
      icon: HardDrive,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'تعداد فایل‌ها',
      value: storageStats.fileCount.toLocaleString('fa-IR'),
      icon: Files,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'تعداد پوشه‌ها',
      value: storageStats.folderCount.toLocaleString('fa-IR'),
      icon: Folder,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'فضای باقی‌مانده',
      value: formatFileSize(storageStats.availableStorage),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Storage Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            وضعیت فضای ذخیره‌سازی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>استفاده شده</span>
            <span className="font-medium">
              {formatFileSize(storageStats.usedStorage)} از {formatFileSize(storageStats.totalStorage)}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-3" />
          <div className="flex items-center justify-between">
            <Badge variant={usagePercentage > 80 ? 'destructive' : usagePercentage > 60 ? 'secondary' : 'default'}>
              {usagePercentage.toFixed(1)}% استفاده شده
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatFileSize(storageStats.availableStorage)} باقی‌مانده
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}