import { useState } from 'react';
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
import { Payment } from '@/types';
import { mockPayments } from '@/data/mockData';
import { MoreHorizontal, Eye, Download, RefreshCw } from 'lucide-react';
import { AdvancedFilters } from '@/components/ui/AdvancedFilters';
import { AnimatePresence, motion } from 'framer-motion';

const getStatusVariant = (status: Payment['status']) => {
  switch (status) {
    case 'completed':
      return { variant: 'default' as const, label: 'تکمیل شده', color: 'bg-green-100 text-green-800' };
    case 'pending':
      return { variant: 'secondary' as const, label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800' };
    case 'failed':
      return { variant: 'destructive' as const, label: 'ناموفق', color: 'bg-red-100 text-red-800' };
    case 'refunded':
      return { variant: 'outline' as const, label: 'بازگشت داده شده', color: 'bg-gray-100 text-gray-800' };
    default:
      return { variant: 'secondary' as const, label: status, color: 'bg-gray-100 text-gray-800' };
  }
};

const getMethodLabel = (method: Payment['method']) => {
  switch (method) {
    case 'credit_card':
      return 'کارت اعتباری';
    case 'bank_transfer':
      return 'انتقال بانکی';
    case 'digital_wallet':
      return 'کیف پول دیجیتال';
    default:
      return method;
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

const formatCurrency = (amount: number, currency: string) => {
  switch (currency) {
    case 'IRR':
      return `${amount.toLocaleString('fa-IR')} تومان`;
    case 'USD':
      return `$${amount.toLocaleString('en-US')}`;
    case 'EUR':
      return `€${amount.toLocaleString('en-US')}`;
    default:
      return `${amount.toLocaleString('fa-IR')} ${currency}`;
  }
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'شناسه',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'userName',
    header: 'کاربر',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('userName')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const currency = row.original.currency;
      return (
        <div className="font-medium text-left" dir="ltr">
          {formatCurrency(amount, currency)}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const status = row.getValue('status') as Payment['status'];
      const { variant, label } = getStatusVariant(status);
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: 'method',
    header: 'روش پرداخت',
    cell: ({ row }) => {
      const method = row.getValue('method') as Payment['method'];
      return (
        <div className="text-sm text-muted-foreground">
          {getMethodLabel(method)}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'توضیحات',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
        {row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ',
    cell: ({ row }) => (
      <div className="text-sm">{formatDate(row.getValue('createdAt'))}</div>
    ),
  },
  {
    id: 'actions',
    header: 'عملیات',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">باز کردن منو</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" sideOffset={8} className="mr-2 md:mr-0">
            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              کپی شناسه پرداخت
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Eye className="h-4 w-4" />
              مشاهده جزئیات
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Download className="h-4 w-4" />
              دانلود رسید
            </DropdownMenuItem>
            {payment.status === 'failed' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  تلاش مجدد
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PaymentsPage() {
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filtering logic
  const filteredData = mockPayments.filter((item) => {
    const statusMatch = !filters.status || item.status === filters.status;
    const methodMatch = !filters.method || item.method === filters.method;
    const dateFromMatch = !filters.dateFrom || new Date(item.createdAt) >= new Date(filters.dateFrom);
    const dateToMatch = !filters.dateTo || new Date(item.createdAt) <= new Date(filters.dateTo);
    const amountFromMatch = !filters.amountFrom || item.amount >= Number(filters.amountFrom);
    const amountToMatch = !filters.amountTo || item.amount <= Number(filters.amountTo);
    const searchMatch = !filters.search ||
      item.userName.includes(filters.search) ||
      item.description.includes(filters.search) ||
      item.id.includes(filters.search);
    return statusMatch && methodMatch && dateFromMatch && dateToMatch && amountFromMatch && amountToMatch && searchMatch;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-muted transition-colors text-sm font-medium shadow-sm"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M9 18h6" /></svg>
          فیلتر پیشرفته
        </button>
      </div>
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden mb-4"
          >
            <AdvancedFilters filters={filters} setFilters={setFilters} />
          </motion.div>
        )}
      </AnimatePresence>
      <DataTable
        columns={columns}
        data={filteredData}
        title="مدیریت پرداخت‌ها"
        searchPlaceholder="جستجو در پرداخت‌ها..."
        exportFileName="payments"
      />
    </>
  );
}