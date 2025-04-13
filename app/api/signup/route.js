// /app/api/signup/route.js
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('Connected!')

    const userExists = await User.findOne({ email })
    if (userExists) return new Response('User already exists', { status: 400 })

    const newUser = await User.create({ email, password })
    return Response.json({ user: { email: newUser.email } })

  } catch (err) {
    console.error('Signup error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
