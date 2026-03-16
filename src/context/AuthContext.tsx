import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginUser, logout as logoutUser, registerUser } from "@/api/auth";
import { USERS_QUERY_KEY } from "@/constants";
const STORAGE_KEY = "pg_user";

type AuthState = {
  accessToken: string | null;
  user: { id: string; email?: string } | null;
  isAuthenticated: boolean;
  setAuth: (token: string | null, user?: AuthState["user"]) => void;
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

type User = {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    last_logged_at: string;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);
const [user, setUser] = useState<User | null>(() => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
});
  const setAuth = (token: string | null, nextUser?: AuthState["user"]) => {
    setAccessToken(token);
    if (nextUser !== undefined) {
        setUser(nextUser);
        if(nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        else localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const result = await loginUser(data);
      const token = result?.data?.accessToken ?? null;
      const nextUser = result?.data?.user ?? null;
      setAuth(token, nextUser);
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
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken),
      setAuth,
      clearAuth,
      login,
      register,
      logout,
    }),
    [accessToken, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
