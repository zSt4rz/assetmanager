// /lib/auth.js
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserByEmail } from './user'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET, // ✅ Required for JWT encryption

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email)
        if (!user || user.password !== credentials.password) {
          return null
        }
        return { id: user.id, email: user.email }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
}
