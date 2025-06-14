import { User, Payment, SubscriptionPlan, BackupHistory } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'علی احمدی',
    email: 'ali@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:22:00Z',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    id: '2',
    name: 'سارا نجفی',
    email: 'sara@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-14T09:15:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    id: '3',
    name: 'مریم جوادی',
    email: 'maryam@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-13T11:20:00Z',
    lastLogin: '2024-01-18T12:30:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    id: '4',
    name: 'حسین رضایی',
    email: 'hossein@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-01-12T14:45:00Z',
    lastLogin: '2024-01-17T10:15:00Z',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    id: '5',
    name: 'فاطمه کریمی',
    email: 'fateme@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-11T16:30:00Z',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    id: '6',
    name: 'امیر محمدی',
    email: 'amir@example.com',
    role: 'user',
    status: 'pending',
    createdAt: '2024-01-10T08:45:00Z',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
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
    description: 'اشتراک ماهانه پلن Pro',
  },
  {
    id: 'PAY-002',
    userId: '2',
    userName: 'سارا نجفی',
    amount: 150000,
    currency: 'IRR',
    status: 'completed',
    method: 'bank_transfer',
    createdAt: '2024-01-19T14:22:00Z',
    description: 'اشتراک ماهانه پلن Basic',
  },
  {
    id: 'PAY-003',
    userId: '3',
    userName: 'مریم جوادی',
    amount: 500000,
    currency: 'IRR',
    status: 'pending',
    method: 'digital_wallet',
    createdAt: '2024-01-18T16:45:00Z',
    description: 'اشتراک سالانه پلن Business',
  },
  {
    id: 'PAY-004',
    userId: '4',
    userName: 'حسین رضایی',
    amount: 250000,
    currency: 'IRR',
    status: 'failed',
    method: 'credit_card',
    createdAt: '2024-01-17T12:30:00Z',
    description: 'اشتراک ماهانه پلن Pro',
  },
  {
    id: 'PAY-005',
    userId: '5',
    userName: 'فاطمه کریمی',
    amount: 150000,
    currency: 'IRR',
    status: 'refunded',
    method: 'bank_transfer',
    createdAt: '2024-01-16T09:15:00Z',
    description: 'اشتراک ماهانه پلن Basic',
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'رایگان',
    price: 0,
    currency: 'IRR',
    interval: 'monthly',
    features: [
      '۵ گیگابایت فضای ذخیره‌سازی',
      '۱ کاربر',
      'پشتیبان‌گیری هفتگی',
      'پشتیبانی ایمیلی',
      'رمزگذاری پایه'
    ],
    storageLimit: 5,
    maxUsers: 1,
    backupFrequency: 'هفتگی',
    isCurrentPlan: false,
  },
  {
    id: 'pro',
    name: 'حرفه‌ای',
    price: 250000,
    currency: 'IRR',
    interval: 'monthly',
    features: [
      '۱۰۰ گیگابایت فضای ذخیره‌سازی',
      '۵ کاربر',
      'پشتیبان‌گیری روزانه',
      'پشتیبانی ۲۴/۷',
      'رمزگذاری پیشرفته',
      'بازیابی سریع فایل‌ها'
    ],
    storageLimit: 100,
    maxUsers: 5,
    backupFrequency: 'روزانه',
    isPopular: true,
    isCurrentPlan: true,
  },
  {
    id: 'business',
    name: 'کسب‌وکار',
    price: 500000,
    currency: 'IRR',
    interval: 'monthly',
    features: [
      '۱ ترابایت فضای ذخیره‌سازی',
      'کاربران نامحدود',
      'پشتیبان‌گیری لحظه‌ای',
      'پشتیبانی اختصاصی',
      'رمزگذاری سطح بانکی',
      'گزارش‌گیری پیشرفته',
      'API دسترسی',
      'مدیریت متمرکز'
    ],
    storageLimit: 1024,
    maxUsers: -1, // unlimited
    backupFrequency: 'لحظه‌ای',
    isCurrentPlan: false,
  },
];

export const mockBackupHistory: BackupHistory[] = [
  {
    id: 'BH-001',
    fileName: 'گزارش ماهانه.pdf',
    fileSize: 2048576,
    backupDate: '2024-01-20T10:30:00Z',
    status: 'completed',
    backupType: 'automatic',
  },
  {
    id: 'BH-002',
    fileName: 'پروژه طراحی',
    fileSize: 52428800,
    backupDate: '2024-01-20T09:15:00Z',
    status: 'completed',
    backupType: 'automatic',
  },
  {
    id: 'BH-003',
    fileName: 'عکس‌های تیم',
    fileSize: 10485760,
    backupDate: '2024-01-19T16:45:00Z',
    status: 'failed',
    backupType: 'manual',
  },
  {
    id: 'BH-004',
    fileName: 'ویدیو معرفی',
    fileSize: 104857600,
    backupDate: '2024-01-19T14:22:00Z',
    status: 'completed',
    backupType: 'automatic',
  },
  {
    id: 'BH-005',
    fileName: 'آرشیو پروژه',
    fileSize: 20971520,
    backupDate: '2024-01-18T12:30:00Z',
    status: 'in_progress',
    backupType: 'manual',
  },
];