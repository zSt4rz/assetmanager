import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) throw new Error('Missing MongoDB connection string')

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  return mongoose.connect(MONGODB_URI)
}
