import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginUser, logout as logoutUser, registerUser } from "@/api/auth";
import { USERS_QUERY_KEY } from "@/constants";

type AuthUser = {
  id?: string | number;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  last_login_at?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser | null) => void;
  clearAuth: () => void;
  login: (data: { email: string; password: string }) => Promise<{
    status: number;
    data: any;
  }>;
  register: (data: Record<string, unknown>) => Promise<{
    status: number;
    data: any;
  }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);

  const setAuth = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const result = await loginUser(data);
      const nextUser = result?.data?.user ?? null;
      setAuth(nextUser);
      return result;
    },
    [setAuth],
  );

  const register = useCallback(
    async (data: Record<string, unknown>) => {
      const result = await registerUser(data);
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      return result;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setAuth,
      clearAuth,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
