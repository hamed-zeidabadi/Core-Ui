import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, LoginFormData } from '@/types';
// import { authService } from '@/services/authService';
// import { tokenManager } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // For UI testing, we'll set initial state based on the current URL
  // This allows us to see both authenticated and non-authenticated views
  const isLoginPage = window.location.pathname.includes('login') ||
    window.location.pathname.includes('forgot-password');

  const [user, setUser] = useState<AuthUser | null>(isLoginPage ? null : {
    id: '1',
    name: 'مدیر سیستم',
    email: 'admin@example.com',
    role: 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!isLoginPage);

  // Initialize auth state on app load
  useEffect(() => {
    // For UI testing, we'll set auth state based on the current URL
    const isLoginPage = window.location.pathname.includes('login') ||
      window.location.pathname.includes('forgot-password');
    setIsAuthenticated(!isLoginPage);
    setIsLoading(false);
  }, []);

  const checkAuthStatus = () => {
    // For UI testing, we'll set auth state based on the current URL
    const isLoginPage = window.location.pathname.includes('login') ||
      window.location.pathname.includes('forgot-password');
    setIsAuthenticated(!isLoginPage);
    setIsLoading(false);
  };

  const clearAuthState = () => {
    // For UI testing, we'll just log this action
    console.log('Auth state cleared (UI testing mode)');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Mock successful login for UI testing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set mock user data
      const mockUser: AuthUser = {
        id: '1',
        name: 'مدیر سیستم',
        email: credentials.email || 'admin@example.com',
        role: 'admin'
      };

      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Mock logout for UI testing
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Logged out (UI testing mode)');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // For UI testing, we'll actually log out
      clearAuthState();
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // Mock forgot password for UI testing
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Password reset email sent to ${email} (UI testing mode)`);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    forgotPassword,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};