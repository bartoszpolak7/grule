"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/context/auth";
import PageWrapper from "@/components/PageWrapper";

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/shop/games";

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setLoggedIn(data.email);
      router.push(redirect);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  return (
    <PageWrapper className="flex items-center justify-center pt-30">
      <div className="w-full max-w-sm nes-container is-dark with-title">
        <p className="title text-xs">LOGOWANIE</p>

        {error && (
          <div className="nes-container is-error mb-4 text-xs font-bold">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            login.mutate({ email, password });
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
              placeholder="rzepa@pole.pl"
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
              placeholder="frytki123.!$"
            />
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className={`nes-btn ${login.isPending ? "is-disabled" : "is-primary"}`}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            {login.isPending ? "Trwa logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="text-center text-xs pt-4">
          Nie masz konta?{" "}
          <Link
            href="/auth/register"
            className="nes-btn is-success inline text-xs"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
