// /models/User.js
import mongoose from 'mongoose'

const UploadedImageSchema = new mongoose.Schema({
  file: { type: String, required: true },             // File path or filename
  keywordsJson: { type: mongoose.Schema.Types.Mixed }, // Detected items in JSON format
  uploadedAt: { type: Date, default: Date.now },       // Timestamp
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uploadedImages: [UploadedImageSchema],               // List of image objects with metadata
  selectedKeywords: [String],                          // Keywords user has checked across uploads
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
