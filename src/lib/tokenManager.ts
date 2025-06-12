// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem("auth-token");
  },

  setToken: (token: string): void => {
    localStorage.setItem("auth-token", token);
  },

  removeToken: (): void => {
    localStorage.removeItem("auth-token");
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  getUserFromToken: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  },
};
