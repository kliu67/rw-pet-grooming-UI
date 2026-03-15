import { createContext, useContext, useMemo, useState } from "react";
const STORAGE_KEY = "pg_user";

type AuthState = {
  accessToken: string | null;
  user: { id: string; email?: string } | null;
  isAuthenticated: boolean;
  setAuth: (token: string | null, user?: AuthState["user"]) => void;
  clearAuth: () => void;
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

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken),
      setAuth,
      clearAuth,
    }),
    [accessToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
