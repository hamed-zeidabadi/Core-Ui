export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  subscription?: SubscriptionPlan;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'IRR';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: 'credit_card' | 'bank_transfer' | 'digital_wallet';
  createdAt: string;
  description: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  subscription?: SubscriptionPlan;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface UpdateProfileFormData {
  name: string;
  email: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  storageLimit: number; // in GB
  maxUsers: number;
  backupFrequency: string;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
}

export interface BackupHistory {
  id: string;
  fileName: string;
  fileSize: number;
  backupDate: string;
  status: 'completed' | 'failed' | 'in_progress';
  backupType: 'automatic' | 'manual';
}

export interface CloudStorageStats {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  fileCount: number;
  folderCount: number;
  lastBackup?: string;
  nextScheduledBackup?: string;
}