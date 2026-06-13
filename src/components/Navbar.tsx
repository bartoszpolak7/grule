"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart";
import { trpc } from "@/trpc/client";

export default function Navbar() {
  const { isLoggedIn, isLoading } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        backgroundColor: "#111",
        color: "#fff",
        zIndex: 100,
      }}
    >
      {/* Left: brand + main links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link
          href="/"
          style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          Grule
        </Link>
        <Link href="/shop/games" style={{ color: "#ccc" }}>
          Store
        </Link>
        {isLoggedIn && (
          <Link href="/library" style={{ color: "#ccc" }}>
            Library
          </Link>
        )}
      </div>

      {/* Right: cart + auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href="/cart" style={{ color: "#ccc" }}>
          Cart {items.length > 0 && `(${items.length})`}
        </Link>

        {!isLoading &&
          (isLoggedIn ? (
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              style={{
                background: "none",
                border: "1px solid #555",
                color: "#ccc",
                padding: "0.3rem 0.8rem",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              {logout.isPending ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/auth/login" style={{ color: "#ccc" }}>
                Login
              </Link>
              <Link href="/auth/register" style={{ color: "#ccc" }}>
                Register
              </Link>
            </div>
          ))}
      </div>
    </nav>
  );
}
