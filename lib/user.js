// /lib/user.js
import { connectDB } from './mongoose'
import User from '@/models/User'

export async function getUserByEmail(email) {
  await connectDB()
  return await User.findOne({ email })
}
