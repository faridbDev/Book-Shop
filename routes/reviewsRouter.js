import express from "express";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId", isLoggedIn, createReviewCtrl);

export default reviewsRouter;