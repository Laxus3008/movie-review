import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  movieID: {
    type: String,
    required: true
  },    
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Ensure one entry per user per movie in watchlist
watchlistSchema.index({ userID: 1, movieID: 1 }, { unique: true });

const Watchlist = mongoose.models.watchlist || mongoose.model('watchlist', watchlistSchema);

export default Watchlist;
