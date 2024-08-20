import Category from "../models/Category.js"
import asyncHandler from "express-async-handler";

// @desc Create New Category
// @route GET /api/v1/categories
// @access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // Category Exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error("دسته با این نام ساخته شده است");
  }
  // Create The Category
  const cateogry = await Category.create({ name, user: req.userAuthId });
  res.status(201).json({ status: "Success", message: "دسته با موفقیت ساخته شد", cateogry });
});

// @desc Get All Books
// @route GET /api/v1/books
// @access Public
export const getCategoriesCtrl = asyncHandler(async (req, res) => {
  // Query
  let bookQuery = Book.find();
  // Filter By Name
  if (req.query.name) {
    bookQuery = bookQuery.find({ name: { $regex: req.query.name, $options: "i" }});
  }
  // Filter By Writer
  if (req.query.writer) {
    bookQuery = bookQuery.find({ writer: { $regex: req.query.writer, $options: "i" }});
  }
  // Filter By publishedYear
  if (req.query.publishedyear) {
    bookQuery = bookQuery.find({ publishedYear: req.query.publishedyear });
  }
  // Filter By Category
  if (req.query.categories) {
    bookQuery = bookQuery.find({ categories: { $regex: req.query.categories, $options: "i" }});
  }
  // Filter By Price Range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    bookQuery = bookQuery.find({ price: { $gte: priceRange[0], $lte: priceRange[1] }});
  }
  // Pagination
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Book.countDocuments();

  bookQuery = bookQuery.skip(startIndex).limit(limit);

  // Pagination Results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit};
  }
  if (startIndex > 0) {
    pagination.prev = { page: page -1, limit };
  }
  // Await The Query
  const books = await bookQuery;
  res.status(200).json({ status: "Success", total, results: books.length, pagination,
    message: "کتاب‌ها با موفقیت پیدا شدند", books });
});

// @desc Get Single Book
// @route GET /api/v1/books/:bookId
// @access Public
export const getCategoryCtrl = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    throw new Error("کتاب با این مشخصات پیدا نشد");
  }
  res.status(200).json({ status: "Success", message: "کتاب با موفقیت پیدا شد", book });
});

// @desc Update Book
// @route PUT /api/v1/books/update/:bookId
// @access Private
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name, description, writer, translator, publishedYear, categories, price, totalQty } = req.body;
  // Update
  const book = await Book.findByIdAndUpdate(req.params.bookId, { name, description, writer, translator, publishedYear,
    categories, price, totalQty }, { new: true });
  res.status(200).json({ status: "Success", message: "کتاب با موفقیت بروزرسانی شد", book });
});

// @desc Delete Book
// @route PUT /api/v1/books/delete/:bookId
// @access Private
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const bookFound = await Book.findById(req.params.bookId);
  if (!bookFound) {
    throw new Error("کتاب با این مشخصات پیدا نشد");
  }
  await Book.findByIdAndDelete(req.params.bookId);
  res.status(200).json({ status: "Success", message: "کتاب با موفقیت حذف شد" });
});