// /app/api/upload/route.js
import { writeFile, mkdir } from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return new Response('Missing file', { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadDir = path.join(process.cwd(), 'public/uploads')
  const filename = Date.now() + '-' + file.name
  const filepath = path.join(uploadDir, filename)

  // Ensure upload folder exists
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  await writeFile(filepath, buffer)
  const filePath = `/uploads/${filename}`

  const keywordsJson = await mockKeywordAnalysis(filepath)

  await connectDB()

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    console.log("user not found");
    return new Response('User not found', { status: 404 })
  }

  await User.findByIdAndUpdate(user._id, {
    $push: {
      assets: {
        file: filePath,
        keywordsJson,
        uploadedAt: new Date(),
      },
    },
  })

  return Response.json({ message: 'Image uploaded and analyzed.', file: filePath, keywordsJson })
}

async function mockKeywordAnalysis(filepath) {
  return {
    cat: 1,
    street: 1,
    grass: 2,
    person: 1,
  }
}