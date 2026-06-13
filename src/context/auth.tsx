"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { trpc } from "@/trpc/client";

type AuthContext = {
  accessToken: string | null;
  email: string | null;
  isLoading: boolean;
  setAuth: (token: string, email: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // droga mutacji: klient trpc -> auth router -> procedura refresh
  const refresh = trpc.auth.refresh.useMutation();

  const setAuth = (token: string, email: string) => {
    setAccessToken(token);
    setEmail(email);
  };

  // REACT COMPILER OGARNIE, W RAZIE CZEGO WYMIENIĆ

  // const setAuth = useCallback((token: string, email: string) => {
  //   setAccessToken(token)
  //   setEmail(email)
  // }, [])

  const clearAuth = () => {
    setAccessToken(null);
    setEmail(null);
  };

  // const clearAuth = useCallback(() => {
  //   setAccessToken(null)
  //   setEmail(null)
  // }, [])

  // On mount - spróbuj wykorzystać refresh token do wznowienia sesji
  useEffect(() => {
    refresh.mutate(undefined, {
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
    // tylko on mount, można wyłączyć eslinta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // COMPILER OGARNIE MEMO
    <AuthContext.Provider
      value={{ accessToken, email, isLoading, setAuth, clearAuth }}
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
