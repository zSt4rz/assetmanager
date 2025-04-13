// /app/api/finalize/route.js
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { file, selectedKeywords } = await req.json()

  if (!file || !Array.isArray(selectedKeywords)) {
    return new Response('Missing file or selected keywords', { status: 400 })
  }

  await connectDB()

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  // Ensure selectedKeywords are updated
  await User.updateOne(
    { _id: user._id },
    { $addToSet: { selectedKeywords: { $each: selectedKeywords } } }
  )

  // Optional: also mark the image as finalized (if needed)
  await User.updateOne(
    { _id: user._id, 'assets.file': file },
    { $set: { 'assets.$.finalized': true } }
  )

  return Response.json({ message: 'Selected keywords saved successfully.' })
}
