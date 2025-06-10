import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';

const getStatusVariant = (status: User['status']) => {
  switch (status) {
    case 'active':
      return { variant: 'default' as const, label: 'فعال' };
    case 'inactive':
      return { variant: 'secondary' as const, label: 'غیرفعال' };
    case 'pending':
      return { variant: 'outline' as const, label: 'در انتظار' };
    default:
      return { variant: 'secondary' as const, label: status };
  }
};

const getRoleVariant = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return { variant: 'destructive' as const, label: 'مدیر' };
    case 'moderator':
      return { variant: 'default' as const, label: 'ناظر' };
    case 'user':
      return { variant: 'secondary' as const, label: 'کاربر' };
    default:
      return { variant: 'secondary' as const, label: role };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'نام',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'ایمیل',
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'نقش',
    cell: ({ row }) => {
      const role = row.getValue('role') as User['role'];
      const { variant, label } = getRoleVariant(role);
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const status = row.getValue('status') as User['status'];
      const { variant, label } = getStatusVariant(status);
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ عضویت',
    cell: ({ row }) => (
      <div className="text-sm">{formatDate(row.getValue('createdAt'))}</div>
    ),
  },
  {
    accessorKey: 'lastLogin',
    header: 'آخرین ورود',
    cell: ({ row }) => {
      const lastLogin = row.getValue('lastLogin') as string | undefined;
      return (
        <div className="text-sm text-muted-foreground">
          {lastLogin ? formatDate(lastLogin) : 'هرگز'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'عملیات',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">باز کردن منو</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" sideOffset={8} className="mr-2 md:mr-0">
            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              کپی شناسه کاربر
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Eye className="h-4 w-4" />
              مشاهده جزئیات
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Edit className="h-4 w-4" />
              ویرایش کاربر
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              حذف کاربر
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersPage() {
  return (
    <DataTable
      columns={columns}
      data={mockUsers}
      title="مدیریت کاربران"
      searchPlaceholder="جستجو در کاربران..."
      exportFileName="users"
    />
  );
}