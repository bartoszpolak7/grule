"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { trpc } from "@/trpc/client";

type AuthContext = {
  isLoggedIn: boolean;
  isLoading: boolean;
  email: string | null;
  setLoggedIn: (email: string) => void;
  setLoggedOut: () => void;
};

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // droga mutacji: klient trpc -> auth router -> procedura refresh
  const refresh = trpc.auth.refresh.useMutation();

  const setLoggedIn = (email: string) => {
    setIsLoggedIn(true);
    setEmail(email);
  };

  const setLoggedOut = () => {
    setIsLoggedIn(false);
    setEmail(null);
  };

  // On mount - spróbuj wykorzystać refresh token do wznowienia sesji
  useEffect(() => {
    refresh.mutate(undefined, {
      onSuccess: () => {
        setIsLoggedIn(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
    // tylko on mount, można wyłączyć eslinta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, email, setLoggedIn, setLoggedOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
