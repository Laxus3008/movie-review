import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import Watchlist from '../models/Watchlist.js'
import Movie from '../models/Movie.js'

//api to register user
const registerUser = async (req, res) => {
    try {
        
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.json({success: false, message: "All fields are required"})
        }

        if(!validator.isEmail(email)) {
            return res.json({success: false, message: "Invalid email"})
        }

        if(password.length < 6) {
            return res.json({success: false, message: "Password must be at least 6 characters long"})
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name, 
            email,
            password: hashedPassword
        }

        const newUser = new User(userData);
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.json({success: true, token})



    } catch (error) {
        console.log(error)
        res.json({success: false, message: "something went wrong in userController registerUser " + error.message})
        
    }
}

const loginUser = async (req, res) => {
    try {

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.json({success: false, message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            res.json({success: true, token})
        }
        else {
            res.json({success: false, message: "Invalid password"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in userController loginUser " + error.message})
        
    }
}

//api to get user details
const getProfile = async (req, res) => {
    try {
        
        const {userId} = req;

        const userData = await User.findById(userId).select('-password');

        res.json({success: true, userData})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in userController getProfile " + error.message})
    }
}

const updateProfile = async (req, res) => {

    try {


        const {userId} = req;

        const {name} = req.body;

        const imageFile = req.file;

        if(!name ) {
            return  res.json({success:false, message:"Data Missing"})
        }

        await User.findByIdAndUpdate(userId, {name})

        if(imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});

            const imageUrl = imageUpload.secure_url;

            await User.findByIdAndUpdate(userId, {profilePicture: imageUrl})

        }

        res.json({success: true, message: "Profile updated successfully"})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in userController updateProfile " + error.message})
    }
}

// API to add movie to user's watchlist
const addToWatchlist = async (req, res) => {
    try {
        const { userId } = req; // Get userId from request object
        const { movieId } = req.body;

        // Validate required fields
        if (!movieId) {
            return res.json({
                success: false,
                message: "Movie ID is required"
            });
        }

        // Validate userId format (basic MongoDB ObjectId validation)
        if (!userId || userId.length !== 24) {
            return res.json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Validate movieId format
        if (!movieId || movieId.length !== 24) {
            return res.json({
                success: false,
                message: "Invalid movie ID format"
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

        // Check if movie is already in watchlist
        const existingWatchlistItem = await Watchlist.findOne({
            userID: userId,
            movieID: movieId
        });

        if (existingWatchlistItem) {
            return res.json({
                success: false,
                message: "Movie is already in your watchlist"
            });
        }

        // Create watchlist entry
        const watchlistData = {
            userID: userId,
            movieID: movieId
        };

        const newWatchlistItem = new Watchlist(watchlistData);
        const savedWatchlistItem = await newWatchlistItem.save();

        // Populate movie details for response
        const populatedWatchlistItem = await Watchlist.findById(savedWatchlistItem._id)
            .populate('movieID', 'title releaseYear genre director posterURL averageRating')
            .populate('userID', 'username email');

        res.json({
            success: true,
            message: "Movie added to watchlist successfully",
            watchlistItem: populatedWatchlistItem
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong in userController addToWatchlist: " + error.message
        });
    }
};

// API to retrieve user's watchlist
const getUserWatchlist = async (req, res) => {
    try {
        const { userId } = req; // Get userId from request object
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'dateAdded', 
            sortOrder = 'desc' 
        } = req.query;

        // Validate userId format (basic MongoDB ObjectId validation)
        if (!userId || userId.length !== 24) {
            return res.json({
                success: false,
                message: "Invalid user ID format"
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

        // Calculate pagination
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Build sort object
        const sort = {};
        const validSortFields = ['dateAdded', 'createdAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'dateAdded';
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;

        // Get watchlist items with pagination and complete movie details
        const watchlistItems = await Watchlist.find({ userID: userId })
            .populate('movieID', 'title releaseYear genre director posterURL averageRating synopsis cast createdAt updatedAt')
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)
            .lean();

        // Get total count for pagination
        const totalItems = await Watchlist.countDocuments({ userID: userId });
        const totalPages = Math.ceil(totalItems / limitNumber);

        // Prepare pagination info
        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalItems,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            limit: limitNumber
        };

        // Format response with enhanced movie details
        const watchlist = watchlistItems.map(item => ({
            _id: item._id,
            movie: item.movieID,
            dateAdded: item.dateAdded,
            addedToWatchlistAt: item.createdAt,
            lastUpdated: item.updatedAt
        }));

        res.json({
            success: true,
            message: "Watchlist retrieved successfully",
            watchlist,
            pagination,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong in userController getUserWatchlist: " + error.message
        });
    }
};

// API to remove movie from user's watchlist
const removeFromWatchlist = async (req, res) => {
    try {
        const {userId} = req; // Get userId from request object
        const { movieId } = req.params; // Get movieId from URL params

        // Validate userId format (basic MongoDB ObjectId validation)
        if (!userId || userId.length !== 24) {
            return res.json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Validate movieId format
        if (!movieId || movieId.length !== 24) {
            return res.json({
                success: false,
                message: "Invalid movie ID format"
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

        // Check if movie exists in watchlist
        const watchlistItem = await Watchlist.findOne({
            userID: userId,
            movieID: movieId
        }).populate('movieID', 'title releaseYear');

        if (!watchlistItem) {
            return res.json({
                success: false,
                message: "Movie not found in your watchlist"
            });
        }

        // Remove the movie from watchlist
        await Watchlist.findByIdAndDelete(watchlistItem._id);

        res.json({
            success: true,
            message: "Movie removed from watchlist successfully",
            removedMovie: {
                _id: watchlistItem.movieID._id,
                title: watchlistItem.movieID.title,
                releaseYear: watchlistItem.movieID.releaseYear
            },
            removedAt: new Date().toISOString()
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong in userController removeFromWatchlist: " + error.message
        });
    }
};

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    addToWatchlist,
    getUserWatchlist,
    removeFromWatchlist
}