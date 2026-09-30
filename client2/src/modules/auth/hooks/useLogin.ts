
import { useState } from "react";
import { authService } from "../services/authService";
import { User } from "../../../types";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔐 LOGIN START");
      console.log("📧 EMAIL:", email);
      console.log("🔑 PASSWORD PROVIDED:", !!password);

      const user = await authService.login({
        email,
        password,
      });

      console.log("✅ LOGIN SUCCESS:", user);

      return user;
    } catch (err: any) {
      console.error("❌ LOGIN FAILED:", err);

      const message =
        err?.message || "Login failed. Please check your email and password.";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}
