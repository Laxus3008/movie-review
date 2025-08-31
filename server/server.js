import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import movieRouter from './routes/movieRoute.js';
import reviewRouter from './routes/reviewRoute.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middilewares
app.use(express.json());
app.use(cors());



app.get('/', (req, res)=>{
    res.send('api working great');
})

app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/movie', movieRouter)
app.use('/api/review', reviewRouter)

app.listen(port, ()=> console.log(`Server is running on port ${port}`))