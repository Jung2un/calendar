import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const u = localStorage.getItem("calendar-user");
      if (u) setUser(u);
    } catch (e) {
      console.error(e);
    }
  }, []);

  function login(email: string) {
    if (typeof window === "undefined") return;

    localStorage.setItem("calendar-user", email);
    setUser(email);
  }

  function logout() {
    if (typeof window === "undefined") return;

    localStorage.removeItem("calendar-user");
    setUser(null);
  }

  return { user, login, logout };
}
