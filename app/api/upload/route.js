import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

  try {
    const keywordsJson = await analyzeWithGemini(file)

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      console.log("user not found")
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    await User.findByIdAndUpdate(user._id, {
      $push: {
        assets: {
          file: 'inline',
          keywordsJson,
          uploadedAt: new Date(),
        },
      },
    })

    return Response.json({ message: 'Image uploaded and analyzed.', keywordsJson })

  } catch (error) {
    console.error('Error during processing:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

async function analyzeWithGemini(file) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-01-21' })

  const prompt = `List every distinct item in this image and their counts. If items are close enough together in the same category, just group them together, such as chess pieces and billiard balls; make sure after you group them together, you still provide the amount of items of that group there is. DO NOT INCLUDE ANY PEOPLE IN THE LIST OF ITEMS
Format exactly like this:
- Item 1: Price of Item 1
- Item 2: Price of Item 2

Give a rough estimate of the prices of the items in the image, if possible. If you can't estimate the price, just say "0".  DO NOT PUT THE $ SIGN IN FRONT OF THE PRICE.
Include only the list, no explanations or additional text.
At the end, say exactly this: Perfect! A [List all the items that were added, not the amount that were added] were added to your inventory. `

const buffer = Buffer.from(await file.arrayBuffer())

const result = await model.generateContent({
  contents: [
    {
      role: 'user',
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: file.type,
            data: buffer.toString('base64'),
          },
        },
      ],
    },
  ],
  generationConfig: {
    responseMimeType: 'text/plain',
  },
})


  const response = await result.response
  const text = response.text()

  return parseGeminiResponse(text)
}

function parseGeminiResponse(responseText) {
  const items = {}
  const lines = responseText.trim().split('\n')

  for (const line of lines) {
    if (line.startsWith('-')) {
      const parts = line.slice(2).split(': ')
      if (parts.length === 2) {
        const item = parts[0].trim()
        const price = parts[1].trim()
        const value = isNaN(price) ? 0 : parseInt(price)
        items[item] = value
      }
    }
  }

  return items
}
