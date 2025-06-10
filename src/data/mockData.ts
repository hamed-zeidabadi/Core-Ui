import { User, Payment } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'علی احمدی',
    email: 'ali.ahmadi@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:22:00Z'
  },
  {
    id: '2',
    name: 'فاطمه محمدی',
    email: 'fateme.mohammadi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-01-19T11:45:00Z'
  },
  {
    id: '3',
    name: 'حسن کریمی',
    email: 'hassan.karimi@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: '2024-01-05T16:20:00Z',
    lastLogin: '2024-01-18T08:30:00Z'
  },
  {
    id: '4',
    name: 'زهرا رضایی',
    email: 'zahra.rezaei@example.com',
    role: 'user',
    status: 'pending',
    createdAt: '2024-01-12T12:45:00Z'
  },
  {
    id: '5',
    name: 'محمد حسینی',
    email: 'mohammad.hosseini@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-08T14:10:00Z',
    lastLogin: '2024-01-20T09:15:00Z'
  },
  {
    id: '6',
    name: 'مریم جوادی',
    email: 'maryam.javadi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-18T11:30:00Z',
    lastLogin: '2024-01-20T16:20:00Z'
  },
  {
    id: '7',
    name: 'رضا فراهانی',
    email: 'reza.farahani@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-01-03T13:25:00Z',
    lastLogin: '2024-01-19T10:40:00Z'
  },
  {
    id: '8',
    name: 'سارا نجفی',
    email: 'sara.najafi@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-14T15:55:00Z',
    lastLogin: '2024-01-17T12:15:00Z'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    userId: '1',
    userName: 'علی احمدی',
    amount: 250000,
    currency: 'IRR',
    status: 'completed',
    method: 'credit_card',
    createdAt: '2024-01-20T10:30:00Z',
    description: 'خرید اشتراک ماهانه'
  },
  {
    id: 'PAY-002',
    userId: '2',
    userName: 'فاطمه محمدی',
    amount: 150000,
    currency: 'IRR',
    status: 'pending',
    method: 'bank_transfer',
    createdAt: '2024-01-19T14:22:00Z',
    description: 'پرداخت هزینه خدمات'
  },
  {
    id: 'PAY-003',
    userId: '5',
    userName: 'محمد حسینی',
    amount: 500000,
    currency: 'IRR',
    status: 'completed',
    method: 'digital_wallet',
    createdAt: '2024-01-18T09:15:00Z',
    description: 'خرید بسته پیشرفته'
  },
  {
    id: 'PAY-004',
    userId: '6',
    userName: 'مریم جوادی',
    amount: 75000,
    currency: 'IRR',
    status: 'failed',
    method: 'credit_card',
    createdAt: '2024-01-17T16:45:00Z',
    description: 'تمدید اشتراک'
  },
  {
    id: 'PAY-005',
    userId: '3',
    userName: 'حسن کریمی',
    amount: 320000,
    currency: 'IRR',
    status: 'refunded',
    method: 'bank_transfer',
    createdAt: '2024-01-16T11:20:00Z',
    description: 'بازگشت وجه خرید'
  },
  {
    id: 'PAY-006',
    userId: '7',
    userName: 'رضا فراهانی',
    amount: 180000,
    currency: 'IRR',
    status: 'completed',
    method: 'digital_wallet',
    createdAt: '2024-01-15T13:30:00Z',
    description: 'خرید خدمات اضافی'
  },
  {
    id: 'PAY-007',
    userId: '1',
    userName: 'علی احمدی',
    amount: 420000,
    currency: 'IRR',
    status: 'pending',
    method: 'credit_card',
    createdAt: '2024-01-14T08:45:00Z',
    description: 'خرید اشتراک سالانه'
  },
  {
    id: 'PAY-008',
    userId: '8',
    userName: 'سارا نجفی',
    amount: 95000,
    currency: 'IRR',
    status: 'completed',
    method: 'bank_transfer',
    createdAt: '2024-01-12T17:10:00Z',
    description: 'پرداخت هزینه نگهداری'
  }
];