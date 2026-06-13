'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/trpc/client'
import { useAuth } from '@/context/auth'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setAuth(data.accessToken, data.email)
      router.push('/games')
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  return (
    <main>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        login.mutate({ email, password })
      }}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={login.isPending}>
          {login.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>No account? <Link href="/register">Register</Link></p>
    </main>
  )
}