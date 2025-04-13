// /app/api/login/route.js
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    await connectDB()

    const user = await User.findOne({ email })
    if (!user || user.password !== password) {
      console.log('Account not found.')
      return new Response('Invalid email or password', { status: 401 })
    }
    
    console.log('Logged In!...')
    return Response.json({ success: true, user: { id: user._id, email: user.email } })
  } catch (err) {
    console.log('Server Error')
    return new Response('Internal server error', { status: 500 })
  }
}
