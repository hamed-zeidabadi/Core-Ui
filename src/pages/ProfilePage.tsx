import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { UpdateProfileFormData, ChangePasswordFormData } from '@/types';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Loader2,
  Crown,
  Calendar,
  HardDrive
} from 'lucide-react';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('لطفاً یک ایمیل معتبر وارد کنید'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
  newPassword: z.string().min(6, 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد'),
  confirmPassword: z.string().min(1, 'تأیید رمز عبور الزامی است'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "رمز عبور جدید و تأیید آن باید یکسان باشند",
  path: ["confirmPassword"],
});

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onUpdateProfile = async (data: UpdateProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      await updateProfile(data);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی پروفایل');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      passwordForm.reset();
      toast.success('رمز عبور با موفقیت تغییر کرد');
    } catch (error: any) {
      toast.error(error.message || 'خطا در تغییر رمز عبور');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} گیگابایت`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">پروفایل کاربری</h1>
        <p className="text-muted-foreground">
          مدیریت اطلاعات حساب کاربری و تنظیمات امنیتی
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role === 'admin' ? 'مدیر' : user.role === 'moderator' ? 'ناظر' : 'کاربر'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.subscription && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">پلان فعلی</span>
                      <Badge variant="default" className="gap-1">
                        <Crown className="h-3 w-3" />
                        {user.subscription.name}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">فضای ذخیره‌سازی</span>
                      <span>{formatStorage(user.subscription.storageLimit * 1024 * 1024 * 1024)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">تعداد کاربران</span>
                      <span>{user.subscription.maxUsers === -1 ? 'نامحدود' : user.subscription.maxUsers}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  اطلاعات شخصی
                </CardTitle>
                <CardDescription>
                  به‌روزرسانی اطلاعات حساب کاربری
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">نام</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          className="pr-10"
                          {...profileForm.register('name')}
                        />
                      </div>
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">ایمیل</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pr-10"
                          {...profileForm.register('email')}
                        />
                      </div>
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="gap-2"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isUpdatingProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  تغییر رمز عبور
                </CardTitle>
                <CardDescription>
                  برای امنیت حساب خود، رمز عبور قوی انتخاب کنید
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register('currentPassword')}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">رمز عبور جدید</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register('newPassword')}
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأیید رمز عبور جدید</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register('confirmPassword')}
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    variant="outline"
                    className="gap-2"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                    {isChangingPassword ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}