import api, { tokenManager } from "@/lib/api";
import { LoginFormData, AuthUser } from "@/types";

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
      // In production, this would be a real API call
      // For demo purposes, we'll simulate the API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        credentials.email === "admin@example.com" &&
        credentials.password === "password"
      ) {
        // Mock JWT token (in production, this comes from your backend)
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
        };

        return {
          token: mockToken,
          user,
          refreshToken: "mock-refresh-token",
        };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch {
      throw new Error("Login failed");
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // In production, this would call your refresh token endpoint
      const response = await api.post("/auth/refresh", { refreshToken });
      return response.data;
    } catch {
      throw new Error("Token refresh failed");
    }
  }

  async logout(): Promise<void> {
    try {
      // In production, you might want to invalidate the token on the server
      await api.post("/auth/logout");
    } catch {
      // Even if the server call fails, we should still clear local storage
      console.warn("Logout API call failed, but continuing with local cleanup");
    } finally {
      tokenManager.removeToken();
      localStorage.removeItem("auth-user");
      localStorage.removeItem("refresh-token");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch {
      throw new Error("Failed to send reset email");
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post("/auth/reset-password", { token, password: newPassword });
    } catch {
      throw new Error("Failed to reset password");
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
