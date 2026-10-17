import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

interface AuthState {
  ready: boolean;
  isAdmin: boolean;
  email: string | null;
}

const AuthContext = createContext<AuthState>({ ready: false, isAdmin: false, email: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ready: false, isAdmin: false, email: null });
  useEffect(() => api.watchAdmin((isAdmin, email) => setState({ ready: true, isAdmin, email })), []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
