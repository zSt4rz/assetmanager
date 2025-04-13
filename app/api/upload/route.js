import { writeFile, mkdir } from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { exec } from 'child_process'
import util from 'util'

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
  const filename = 'image.jpg' // Static filename
  const filepath = path.join(uploadDir, filename)

  // Ensure upload folder exists
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Delete existing image if it exists
  if (fs.existsSync(filepath)) {
    await fs.promises.unlink(filepath)
  }

  await writeFile(filepath, buffer)
  const filePath = `/uploads/${filename}`
  const execPromise = util.promisify(exec)

  try {
    const keywordsJson = await mockKeywordAnalysis(filepath)
  
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

async function mockKeywordAnalysis(filepath) {
  const execPromise = util.promisify(exec)

  try {
    // Ensure the script path is correct
    const scriptPath = path.resolve(process.cwd(), 'scripts/analyze.py')

    const isWindows = process.platform === 'win32'
    const pythonCmd = isWindows ? 'python' : 'python3'


    const { stdout, stderr } = await execPromise(`${pythonCmd} ${scriptPath} ${filepath}`)

    if (stderr) {
      console.error('Error from Python script:', stderr)
      throw new Error('Error running Python script')
    }

    // Assuming the Python script returns JSON output with keyword analysis
    const keywordsJson = JSON.parse(stdout)

    return keywordsJson
  } catch (error) {
    console.error('Error during keyword analysis:', error)
    throw error
  }
}
