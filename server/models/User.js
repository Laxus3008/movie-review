import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: null // URL to profile picture or null if no picture
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
})

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;