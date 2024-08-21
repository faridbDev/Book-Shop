import Review from "../models/Review.js";
import Book from "../models/Book.js";
import asyncHandler from "express-async-handler";

// @desc   Create New Review
// @route  GET /api/v1/reviews
// @access Public
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { book, message, rating } = req.body;
  // Find The Book
  const { productId } = req.params;
  const bookFound = await Book.findById(productId).populate("reviews");
  if (!bookFound) {
    throw new Error("کتاب با این مشخصات پیدا نشد");
  }
  // Check If the User Already Reviewed This Product
  const hasReviewed = bookFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("شما قبلا در مورد این کتاب نظر دادید");
  }
  // Create Review
  const review = await Review.create({ message, rating, book: bookFound?._id, user: req.userAuthId });
  // Push Review Into The Book Found And Save
  bookFound.reviews.push(review?._id);
  await bookFound.save();
  res.status(201).json({ status: "Success", message: "نظر شما با موفقیت ساخته شد", review });
});