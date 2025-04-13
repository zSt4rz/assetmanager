// /app/api/inventory/route.js
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectDB()
  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  return Response.json({ uploadedImages: user.uploadedImages || [] })
}
