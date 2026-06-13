'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/trpc/client'
import { useAuth } from '@/context/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const register = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setAuth(data.accessToken, data.email)

      // router w Next.js korzysta z push() do nawigacji
      router.push('/shop/games')
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  return (
    <main>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        register.mutate({ email, password })
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
        <button type="submit" disabled={register.isPending}>
          {register.isPending ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link href="/auth/login">Login</Link></p>
    </main>
  )
}