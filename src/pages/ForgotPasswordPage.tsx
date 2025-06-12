import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { ForgotPasswordFormData } from "@/types";
import {
  Loader2,
  Mail,
  ArrowRight,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("لطفاً یک ایمیل معتبر وارد کنید"),
});

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await forgotPassword(data.email); // Pass data.email here
      setEmailSent(true);
      toast.success("ایمیل بازیابی رمز عبور ارسال شد");
    } catch {
      toast.error("خطا در ارسال ایمیل بازیابی");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold">بازیابی رمز عبور</h2>
          <p className="text-muted-foreground mt-2">
            ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">
              {emailSent ? "ایمیل ارسال شد" : "فراموشی رمز عبور"}
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent
                ? "لطفاً ایمیل خود را بررسی کنید"
                : "ایمیل حساب کاربری خود را وارد کنید"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  ایمیل حاوی لینک بازیابی رمز عبور به آدرس ایمیل شما ارسال شده
                  است. اگر ایمیل را دریافت نکردید، لطفاً پوشه هرزنامه خود را
                  بررسی کنید.
                </p>
                <div className="pt-4">
                  <Link to="/login">
                    <Button className="w-full gap-2">
                      <ArrowRight className="h-4 w-4" />
                      بازگشت به صفحه ورود
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Message */}
                {errors.email && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@domain.com"
                      className="pr-10"
                      {...register("email")}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    "ارسال لینک بازیابی"
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    بازگشت به صفحه ورود
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
