import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import type { LoginCredentials } from "../types/auth.types";

export function useLogin() {
  const { handleLogin, loading, error } = useAuthContext();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  function handleChange(field: keyof LoginCredentials, value: string): void {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const ok = await handleLogin(credentials);
    if (ok) navigate("/proveedores", { replace: true });
  }

  return { credentials, handleChange, handleSubmit, loading, error };
}