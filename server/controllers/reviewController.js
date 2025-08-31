import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';

// API to submit a new review for a movie
const submitReview = async (req, res) => {
    try {
        const { userId } = req; // Get userId from URL params
        const { movieId, rating, reviewText } = req.body;

        // Validate required fields
        if (!movieId || !rating || !reviewText) {
            return res.json({
                success: false,
                message: "movieId, rating, and reviewText are required"
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return res.json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Check if movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.json({
                success: false,
                message: "Movie not found"
            });
        }

        // Check if user has already reviewed this movie
        const existingReview = await Review.findOne({
            userID: userId,
            movieID: movieId
        });

        if (existingReview) {
            return res.json({
                success: false,
                message: "You have already reviewed this movie. Use update review instead."
            });
        }

        // Create review data
        const reviewData = {
            userID: userId,
            movieID: movieId,
            rating: parseInt(rating),
            reviewText: reviewText.trim()
        };

        // Create and save new review
        const newReview = new Review(reviewData);
        const savedReview = await newReview.save();

        // Update movie's average rating
        await updateMovieAverageRating(movieId);

        // Populate user and movie details for response
        const populatedReview = await Review.findById(savedReview._id)
            .populate('userID', 'username email')
            .populate('movieID', 'title releaseYear');

        res.json({
            success: true,
            message: "Review submitted successfully",
            review: populatedReview
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong in reviewController submitReview: " + error.message
        });
    }
};

// Helper function to update movie's average rating
const updateMovieAverageRating = async (movieId) => {
    try {
        const reviews = await Review.find({ movieID: movieId });
        
        if (reviews.length === 0) {
            await Movie.findByIdAndUpdate(movieId, { averageRating: 0 });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);

        await Movie.findByIdAndUpdate(movieId, { 
            averageRating: parseFloat(averageRating) 
        });

    } catch (error) {
        console.log("Error updating movie average rating:", error);
    }
};

export {
    submitReview
};