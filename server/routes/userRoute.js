import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, addToWatchlist, getUserWatchlist, removeFromWatchlist } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/getProfile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/add-to-watchlist', authUser, addToWatchlist)
userRouter.get('/get-user-watchlist', authUser, getUserWatchlist)
userRouter.delete('/remove-from-watchlist/:movieId', authUser, removeFromWatchlist)

export default userRouter;