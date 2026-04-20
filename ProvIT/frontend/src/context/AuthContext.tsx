import { createContext, useContext, useState } from "react";
import { loginService } from "../services/authService";
import type { Usuario, LoginCredentials } from "../types/auth.types";

interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  handleLogin: (credentials: LoginCredentials) => Promise<boolean>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as Usuario) : null;
  });
  const [loading,       setLoading]       = useState<boolean>(false);
  const [error,         setError]         = useState<string | null>(null);

  // localStorage se lee sincrónicamente en el useState inicial,
  // así que isInitialized siempre arranca en true
  const [isInitialized] = useState<boolean>(true);

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(credentials);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : "Error de conexión con el servidor.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isInitialized, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}