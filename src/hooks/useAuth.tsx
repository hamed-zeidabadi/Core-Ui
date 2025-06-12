import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { AuthUser, LoginFormData } from '@/types';
import { authService } from '@/services/authService';
import { tokenManager } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setIsLoading(true);
    try {
      const token = tokenManager.getToken();
      const savedUser = localStorage.getItem('auth-user');
      
      if (token && !tokenManager.isTokenExpired(token) && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
    tokenManager.removeToken();
    localStorage.removeItem('auth-user');
    localStorage.removeItem('refresh-token');
  };

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);
      
      // Store tokens and user data
      tokenManager.setToken(response.token);
      localStorage.setItem('auth-user', JSON.stringify(response.user));
      localStorage.setItem('refresh-token', response.refreshToken);

      // Update state
      setUser(response.user);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      clearAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState();
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<AuthUser>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    forgotPassword,
    updateProfile,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};