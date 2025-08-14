import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthToken, login as apiLogin, register as apiRegister, setAuthToken } from "../services/api";

/**
 * AuthContext manages user, token, role and exposes login/register/logout
 */

const AuthContext = createContext(undefined);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions to child components. */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pb_user");
    const t = localStorage.getItem("pb_token");
    if (t) setAuthToken(t);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setToken(t || null);
      } catch (_e) {
        // ignore
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pb_user");
    clearAuthToken();
  };

  const login = async ({ email, password, role = "user" }) => {
    const result = await apiLogin({ email, password, role });
    setToken(result.token || null);
    setUser(result.user || { email, role });
    localStorage.setItem("pb_user", JSON.stringify(result.user || { email, role }));
    return result;
  };

  const register = async ({ name, email, password, role = "user" }) => {
    const result = await apiRegister({ name, email, password, role });
    setToken(result.token || null);
    setUser(result.user || { name, email, role });
    localStorage.setItem("pb_user", JSON.stringify(result.user || { name, email, role }));
    return result;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || "guest",
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
