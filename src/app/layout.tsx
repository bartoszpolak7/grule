import { AuthProvider } from "@/context/auth";
import { TRPCProvider } from "@/trpc/provider";
import { CartProvider } from "@/context/cart";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
