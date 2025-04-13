// /models/User.js
import mongoose from 'mongoose'

const UploadedImageSchema = new mongoose.Schema({
  data: { type: String, required: true },         // base64 image string
  contentType: { type: String, required: true },  // MIME type
  keywordsJson: { type: mongoose.Schema.Types.Mixed }, // Detected items in JSON format
  uploadedAt: { type: Date, default: Date.now },       // Timestamp
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uploadedImages: [UploadedImageSchema],               // List of image objects with metadata
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
