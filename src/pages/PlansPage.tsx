import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { subscriptionPlans } from '@/data/mockData';
import { SubscriptionPlan } from '@/types';
import { 
  Check, 
  Crown, 
  Zap, 
  Shield, 
  Users, 
  HardDrive,
  Clock,
  Star,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlansPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setLoadingPlan(planId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (planId === 'free') {
        toast.success('پلان رایگان فعال شد');
      } else {
        toast.success('به صفحه پرداخت هدایت می‌شوید...');
      }
    } catch (error) {
      toast.error('خطا در انتخاب پلان');
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number, currency: string, interval: string) => {
    if (price === 0) return 'رایگان';
    
    const yearlyPrice = isYearly ? price * 10 : price; // 2 months free for yearly
    const formattedPrice = yearlyPrice.toLocaleString('fa-IR');
    const intervalText = isYearly ? 'سالانه' : 'ماهانه';
    
    return `${formattedPrice} تومان / ${intervalText}`;
  };

  const getYearlySavings = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return null;
    const yearlyTotal = monthlyPrice * 10; // 10 months instead of 12
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyTotal;
    return savings.toLocaleString('fa-IR');
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Shield className="h-6 w-6" />;
      case 'pro':
        return <Zap className="h-6 w-6" />;
      case 'business':
        return <Crown className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const formatStorage = (storageGB: number) => {
    if (storageGB >= 1024) {
      return `${(storageGB / 1024).toFixed(1)} ترابایت`;
    }
    return `${storageGB} گیگابایت`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">پلان‌ها و اشتراک</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          پلان مناسب خود را انتخاب کنید و از امکانات پیشرفته پشتیبان‌گیری ابری بهره‌مند شوید
        </p>
      </div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center space-x-4 space-x-reverse"
      >
        <Label htmlFor="billing-toggle" className={cn(!isYearly && "font-semibold")}>
          پرداخت ماهانه
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-toggle" className={cn(isYearly && "font-semibold")}>
          پرداخت سالانه
        </Label>
        {isYearly && (
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            ۲ ماه رایگان
          </Badge>
        )}
      </motion.div>

      {/* Plans Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {subscriptionPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={cn(
              "relative h-full transition-all duration-300 hover:shadow-lg",
              plan.isPopular && "border-primary shadow-md scale-105",
              plan.isCurrentPlan && "ring-2 ring-primary"
            )}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 px-3 py-1">
                    <Crown className="h-3 w-3" />
                    محبوب‌ترین
                  </Badge>
                </div>
              )}
              
              {plan.isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    پلان فعلی
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-4">
                <div className={cn(
                  "mx-auto h-12 w-12 rounded-lg flex items-center justify-center",
                  plan.id === 'free' && "bg-gray-100 text-gray-600",
                  plan.id === 'pro' && "bg-blue-100 text-blue-600",
                  plan.id === 'business' && "bg-purple-100 text-purple-600"
                )}>
                  {getPlanIcon(plan.id)}
                </div>
                
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {plan.id === 'free' && 'برای شروع کار و آشنایی با سرویس'}
                    {plan.id === 'pro' && 'برای کاربران حرفه‌ای و تیم‌های کوچک'}
                    {plan.id === 'business' && 'برای شرکت‌ها و تیم‌های بزرگ'}
                  </CardDescription>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price, plan.currency, plan.interval)}
                  </div>
                  {isYearly && plan.price > 0 && (
                    <div className="text-sm text-green-600">
                      {getYearlySavings(plan.price)} تومان صرفه‌جویی
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      فضای ذخیره‌سازی
                    </span>
                    <span className="font-medium">{formatStorage(plan.storageLimit)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      تعداد کاربران
                    </span>
                    <span className="font-medium">
                      {plan.maxUsers === -1 ? 'نامحدود' : plan.maxUsers}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      پشتیبان‌گیری
                    </span>
                    <span className="font-medium">{plan.backupFrequency}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">ویژگی‌ها:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={plan.isCurrentPlan ? "outline" : plan.isPopular ? "default" : "outline"}
                  disabled={plan.isCurrentPlan || loadingPlan === plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      در حال پردازش...
                    </>
                  ) : plan.isCurrentPlan ? (
                    'پلان فعلی'
                  ) : plan.id === 'free' ? (
                    'انتخاب پلان رایگان'
                  ) : (
                    'ارتقا به این پلان'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-16"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center">سوالات متداول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">آیا می‌توانم پلان خود را تغییر دهم؟</h4>
                <p className="text-sm text-muted-foreground">
                  بله، می‌توانید در هر زمان پلان خود را ارتقا یا کاهش دهید. تغییرات از دوره بعدی اعمال می‌شود.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">آیا پرداخت سالانه تخفیف دارد؟</h4>
                <p className="text-sm text-muted-foreground">
                  بله، با انتخاب پرداخت سالانه، ۲ ماه رایگان دریافت می‌کنید که معادل ۱۷٪ تخفیف است.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">آیا داده‌هایم امن هستند؟</h4>
                <p className="text-sm text-muted-foreground">
                  تمام داده‌ها با رمزگذاری AES-256 محافظت می‌شوند و در مراکز داده امن نگهداری می‌شوند.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">چه مدت زمان برای بازیابی فایل‌ها لازم است؟</h4>
                <p className="text-sm text-muted-foreground">
                  بازیابی فایل‌ها معمولاً کمتر از ۵ دقیقه طول می‌کشد و بسته به اندازه فایل متفاوت است.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}