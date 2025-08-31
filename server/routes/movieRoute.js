import express from 'express';
import { addMovie, getAllMovies, getMovieById } from '../controllers/movieController.js';
import authAdmin from '../middleware/authAdmin.js';
import authUser from '../middleware/authUser.js';
const movieRouter = express.Router();

movieRouter.post('/add', authAdmin, addMovie);
movieRouter.get('/', getAllMovies);
movieRouter.get('/:id', getMovieById);  // Temporarily removed authUser middleware

export default movieRouter;
