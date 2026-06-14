"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart";
import { trpc } from "@/trpc/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ziemniakImg from "@/../public/ziemniak.png";
import gruleImg from "@/../public/grule_title.png";

export default function Navbar() {
  const { isLoggedIn, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { items } = useCart();
  const router = useRouter();

  // anty hydration error, serwer czyta 0 w koszyku, ale klient coś innego
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full bg-white border-b-4 border-black">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={ziemniakImg}
            alt="Grule Potato"
            className="w-auto h-17 object-contain"
            priority // szybkie ładowanie, góra strony
          />
          <Image
            src={gruleImg}
            alt="Grule Title"
            className="w-auto h-17 object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-4 text-xs md:flex">
          <Link href="/shop/games" className="nes-btn">
            Sklep
          </Link>
          {isLoggedIn && (
            <Link href="/library" className="nes-btn">
              Biblioteka
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap justify-end">
          <Link href="/cart" className="nes-btn is-primary">
            Koszyk {mounted && items.length > 0 && `(${items.length})`}
          </Link>

          {!isLoading &&
            (isLoggedIn ? (
              <button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="nes-btn is-error"
              >
                {logout.isPending ? "..." : "Wyloguj się"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="nes-btn">
                  Logowanie
                </Link>
                <Link href="/auth/register" className="nes-btn is-success">
                  Rejestracja
                </Link>
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
}
