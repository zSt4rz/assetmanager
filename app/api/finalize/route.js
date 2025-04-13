// /app/api/finalize/route.js
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { file, contentType, keywordsJson, selectedKeywords } = body;

  if (!file || !keywordsJson || !Array.isArray(selectedKeywords)) {
    return new Response('Missing required fields', { status: 400 })
  }

  const base64 = file;


  await connectDB()

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  // Add selected keywords to user's list
  await User.updateOne(
    { _id: user._id },
    { $addToSet: { selectedKeywords: { $each: selectedKeywords } } }
  )

  // Add finalized image to uploadedImages with base64 content
  await User.findByIdAndUpdate(user._id, {
    $push: {
      uploadedImages: {
        data: base64,
        contentType,
        keywordsJson,
        uploadedAt: new Date(),
      },
    },
  })

  return Response.json({ message: 'Selected keywords and image saved successfully.' })
}

