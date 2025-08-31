import express from 'express';
import { submitReview } from "../controllers/reviewController.js";
import authUser from "../middleware/authUser.js";

const reviewRouter = express.Router();

reviewRouter.post("/submit", authUser, submitReview);

export default reviewRouter;
