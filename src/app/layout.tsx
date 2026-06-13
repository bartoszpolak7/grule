import { AuthProvider } from '@/context/auth'
import { TRPCProvider } from '@/trpc/provider'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <AuthProvider>
          {children}
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  )
}