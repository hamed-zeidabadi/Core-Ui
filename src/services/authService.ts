import api, { tokenManager } from "@/lib/api";
import { LoginFormData, AuthUser, subscriptionPlans } from "@/types";

export interface LoginResponse {
  token: string;
  user: AuthUser;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

class AuthService {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (
        credentials.email === "admin@example.com" &&
        credentials.password === "password"
      ) {
        // Generate mock JWT token
        const mockToken = this.generateMockJWT({
          sub: "1",
          name: "مدیر سیستم",
          email: credentials.email,
          role: "admin",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        });

        const user: AuthUser = {
          id: "1",
          name: "مدیر سیستم",
          email: credentials.email,
          role: "admin",
          avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          subscription: subscriptionPlans.find(plan => plan.id === 'pro'),
        };

        return {
          token: mockToken,
          user,
          refreshToken: "mock-refresh-token",
        };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      return response.data;
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  }

  async logout(): Promise<void> {
    try {
      // In production, invalidate token on server
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.warn("Logout API call failed, but continuing with local cleanup");
    } finally {
      tokenManager.removeToken();
      localStorage.removeItem("auth-user");
      localStorage.removeItem("refresh-token");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      throw new Error("Failed to send reset email");
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post("/auth/reset-password", { token, password: newPassword });
    } catch (error) {
      throw new Error("Failed to reset password");
    }
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would update the user on the server
      const currentUser = JSON.parse(localStorage.getItem('auth-user') || '{}');
      const updatedUser = { ...currentUser, ...data };
      
      return updatedUser;
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In production, verify current password and update
      if (currentPassword !== "password") {
        throw new Error("Current password is incorrect");
      }
      
      console.log("Password changed successfully");
    } catch (error) {
      throw error;
    }
  }

  // Mock JWT generator for demo purposes
  private generateMockJWT(payload: any): string {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = "mock-signature";
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}

export const authService = new AuthService();