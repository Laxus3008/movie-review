import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: [String],
    required: true
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
    trim: true
  },
  cast: {
    type: [String],
    required: true
  },
  synopsis: {
    type: String,
    required: true,
    maxlength: 2000
  },
  posterURL: {
    type: String,
    default: null
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
})

const Movie = mongoose.models.movie || mongoose.model('movie', movieSchema);

export default Movie;