"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/context/auth";
import PageWrapper from "@/components/PageWrapper";

export default function RegisterPage() {
  const router = useRouter();
  const { setLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const register = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setLoggedIn(data.email);
      router.push("/shop/games");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  return (
    <PageWrapper className="flex items-center justify-center pt-30">
      <div className="w-full max-w-sm nes-container is-dark with-title">
        <p className="title text-xs">REJESTRACJA</p>

        {error && (
          <div className="nes-container is-error mb-4 text-xs font-bold">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            register.mutate({ email, password });
          }}
        >
          <div className="nes-field">
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`nes-input ${error ? "is-error" : ""} is-dark`}
              placeholder="farmer1111@gmail.com"
            />
          </div>
          <div className="nes-field" style={{ marginTop: "1rem" }}>
            <label htmlFor="password">HASŁO</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`nes-input ${error ? "is-error" : ""} is-dark`}
              placeholder="pyry00)1^5.,"
            />
          </div>
          <button
            type="submit"
            disabled={register.isPending}
            className={`nes-btn ${register.isPending ? "is-disabled" : "is-success"}`}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            {register.isPending ? "Tworzenie konta..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-center text-xs pt-4">
          Masz już konto?{" "}
          <Link
            href="/auth/login"
            className="nes-btn is-primary inline text-xs"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
