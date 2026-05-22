"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, logout, getStoredUser } from "../api";
import { User } from "@/shared/types";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user: User | null = getStoredUser();

  async function handleLogin(username: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return { handleLogin, handleLogout, loading, error, user };
}
