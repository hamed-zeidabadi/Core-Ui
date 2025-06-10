export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
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
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}