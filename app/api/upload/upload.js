// /app/api/upload/route.js
import { writeFile } from 'fs/promises'
import path from 'path'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')
  const userId = formData.get('userId') // Pass user ID with upload

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = Date.now() + '-' + file.name
  const filepath = path.join(process.cwd(), 'public/uploads', filename)

  await writeFile(filepath, buffer)

  await connectDB()
  await User.findByIdAndUpdate(userId, {
    $push: { assets: `/uploads/${filename}` },
  })

  return Response.json({ success: true, url: `/uploads/${filename}` })
}
