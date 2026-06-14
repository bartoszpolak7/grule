"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function ProtectedPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoggedIn, isLoading, router, pathname]);

  if (isLoading) return <Spinner />;
  if (!isLoggedIn) return null;

  return <>{children}</>;
}

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="nes-container is-dark with-title text-center">
        <p className="title text-xs">LOADING</p>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 text-4xl animate-bounce">⏳</div>
          <p className="text-xs">Authenticating access...</p>
        </div>
      </div>
    </div>
  );
}
