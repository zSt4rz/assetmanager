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
  const uploadDir = path.join(process.cwd(), 'scripts')
  const filename = 'image.jpg'
  const filepath = path.join(uploadDir, filename)

  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  if (fs.existsSync(filepath)) {
    await fs.promises.unlink(filepath)
  }

  await writeFile(filepath, buffer)
  const filePath = `/uploads/${filename}`

  try {
    const keywordsJson = await analyzeWithFlask(filepath)

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      console.log("user not found")
      return Response.json({ error: 'User not found' }, { status: 404 })
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

  } catch (error) {
    console.error('Error during processing:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

async function analyzeWithFlask(filepath) {
  const formData = new FormData()
  formData.append('file', new Blob([await fs.promises.readFile(filepath)]), 'image.jpg')

  const response = await fetch('https://assetmanager-eta.vercel.app/analyze', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error('Flask server error: ' + text)
  }

  return await response.json()
}
