import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Users,
  CreditCard,
  LayoutDashboard,
  Menu,
  LogOut,
  ChevronLeft,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navigation = [
  {
    name: 'داشبورد',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'کاربران',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'پرداخت‌ها',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { logout, user, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('با موفقیت خارج شدید');
    } catch (error) {
      toast.error('خطا در خروج از سیستم');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">پنل مدیریت</span>
              <span className="text-xs text-muted-foreground">نسخه ۱.۰</span>
            </div>
          )}
        </div>
        {/* Theme toggle button */}
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent',
                isActive
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t px-3 py-4">
        {!collapsed && user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground',
            collapsed && 'justify-center px-2'
          )}
          onClick={handleLogout}
          disabled={isLoggingOut || isLoading}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 shrink-0" />
          )}
          {!collapsed && <span>{isLoggingOut ? 'در حال خروج...' : 'خروج'}</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden border-l bg-card transition-all duration-300 md:block',
        collapsed ? 'w-[76px]' : 'w-64',
        className
      )}>
        <div className="relative h-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}