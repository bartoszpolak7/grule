import { AuthProvider } from "@/context/auth";
import { TRPCProvider } from "@/trpc/provider";
import { CartProvider } from "@/context/cart";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <div style={{ paddingTop: "3.5rem" }}>{children}</div>
              {children}
            </CartProvider>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
