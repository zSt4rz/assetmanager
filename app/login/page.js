'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res.ok && !res.error) {
      router.push('/user') // or '/dashboard'
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <main className="h-screen text-amber-950 flex items-center justify-center bg-orange-100">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-2">
        <h2 className="text-xl font-semibold">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-900 text-white p-2 rounded hover:bg-green-950"
          >
            Login
          </button>

        </form>
        <p>Don't have an account? Sign up <Link href="/signup" className="underline">here</Link>.</p>

      </div>
    </main>
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
    //     <h2 className="text-xl font-bold">Login</h2>
    //     {error && <p className="text-red-500 text-sm">{error}</p>}
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       className="w-full border border-gray-300 p-2 rounded"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       className="w-full border border-gray-300 p-2 rounded"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />
    //     <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
    //       Login
    //     </button>
    //   </form>
    // </div>
  )
}
