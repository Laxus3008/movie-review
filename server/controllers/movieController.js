import Movie from '../models/Movie.js';
import Review from '../models/Review.js';

// API to add a new movie
const addMovie = async (req, res) => {
    try {
        const { title, genre, releaseYear, director, cast, synopsis, posterURL } = req.body;

        // Validate required fields
        if (!title || !genre || !releaseYear || !director || !cast || !synopsis) {
            return res.json({
                success: false, 
                message: "All fields except posterURL are required"
            });
        }

        // Validate genre is an array
        if (!Array.isArray(genre) || genre.length === 0) {
            return res.json({
                success: false, 
                message: "Genre must be a non-empty array"
            });
        }

        // Validate cast is an array
        if (!Array.isArray(cast) || cast.length === 0) {
            return res.json({
                success: false, 
                message: "Cast must be a non-empty array"
            });
        }

        // Validate release year
        const currentYear = new Date().getFullYear();
        if (releaseYear < 1888 || releaseYear > currentYear + 5) {
            return res.json({
                success: false, 
                message: "Invalid release year"
            });
        }

        // Check if movie already exists
        const existingMovie = await Movie.findOne({ 
            title: title.trim(), 
            releaseYear: releaseYear 
        });

        if (existingMovie) {
            return res.json({
                success: false, 
                message: "Movie with this title and release year already exists"
            });
        }

        // Create movie data object
        const movieData = {
            title: title.trim(),
            genre: genre.map(g => g.trim()),
            releaseYear,
            director: director.trim(),
            cast: cast.map(c => c.trim()),
            synopsis: synopsis.trim(),
            posterURL: posterURL || null,
            averageRating: 0
        };

        // Create and save new movie
        const newMovie = new Movie(movieData);
        const savedMovie = await newMovie.save();

        res.json({
            success: true,
            message: "Movie added successfully",
            movie: savedMovie
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false, 
            message: "Something went wrong in movieController addMovie: " + error.message
        });
    }
};

// API to get all movies with pagination and filtering
const getAllMovies = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            genre, 
            year, 
            minRating, 
            maxRating, 
            director, 
            search,
            sortBy = 'title',
            sortOrder = 'asc'
        } = req.query;

        // Build filter object
        const filter = {};

        // Search by title (case insensitive)
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // Filter by genre
        if (genre) {
            filter.genre = { $in: [genre] };
        }

        // Filter by release year
        if (year) {
            filter.releaseYear = parseInt(year);
        }

        // Filter by director (case insensitive)
        if (director) {
            filter.director = { $regex: director, $options: 'i' };
        }

        // Filter by rating range
        if (minRating || maxRating) {
            filter.averageRating = {};
            if (minRating) filter.averageRating.$gte = parseFloat(minRating);
            if (maxRating) filter.averageRating.$lte = parseFloat(maxRating);
        }

        // Calculate pagination
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Build sort object
        const sort = {};
        const validSortFields = ['title', 'releaseYear', 'averageRating', 'createdAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'title';
        sort[sortField] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const movies = await Movie.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)
            .lean();

        // Get total count for pagination info
        const totalMovies = await Movie.countDocuments(filter);
        const totalPages = Math.ceil(totalMovies / limitNumber);

        // Prepare response
        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalMovies,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            limit: limitNumber
        };

        res.json({
            success: true,
            message: "Movies retrieved successfully",
            movies,
            pagination,
            filters: {
                genre,
                year,
                minRating,
                maxRating,
                director,
                search,
                sortBy: sortField,
                sortOrder
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong in movieController getAllMovies: " + error.message
        });
    }
};

// API to get a specific movie by ID with reviews
const getMovieById = async (req, res) => {
    try {
        const { id: movieId } = req.params;

        // Validate movieId format (basic MongoDB ObjectId validation)
        if (!movieId || movieId.length !== 24) {
            return res.json({
                success: false,
                message: "Invalid movie ID format"
            });
        }

        // Find the movie by ID
        const movie = await Movie.findById(movieId).lean();

        if (!movie) {
            return res.json({
                success: false,
                message: "Movie not found"
            });
        }

        // Get all reviews for this movie with user details
        const reviews = await Review.find({ movieID: movieId })
            .populate('userID', 'username email profilePicture joinDate')
            .sort({ createdAt: -1 }) // Most recent reviews first
            .lean();

        // Calculate review statistics
        const reviewStats = {
            totalReviews: reviews.length,
            averageRating: movie.averageRating,
            ratingDistribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length
            }
        };

        // Format response
        const movieWithReviews = {
            ...movie,
            reviews,
            reviewStats
        };

        res.json({
            success: true,
            message: "Movie retrieved successfully",
            movie: movieWithReviews
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong in movieController getMovieById: " + error.message
        });
    }
};

export {
    addMovie,
    getAllMovies,
    getMovieById
};