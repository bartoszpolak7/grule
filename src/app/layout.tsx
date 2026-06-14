import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import { AuthProvider } from "@/context/auth";
import { TRPCProvider } from "@/trpc/provider";
import { CartProvider } from "@/context/cart";
import Navbar from "@/components/Navbar";

const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.className} min-h-screen text-black antialiased`}
        style={{ fontSize: "10px" }}
      >
        <TRPCProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {/* padding top 20 żeby zmieścił się navbar */}
              <main className="pt-20">{children}</main>
            </CartProvider>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
