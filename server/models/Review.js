import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  movieID: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Ensure one review per user per movie
reviewSchema.index({ userID: 1, movieID: 1 }, { unique: true });

const Review = mongoose.models.review || mongoose.model('review', reviewSchema);

export default Review;