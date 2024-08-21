import Category from "../models/Category.js"
import asyncHandler from "express-async-handler";

// @desc   Create New Category
// @route  GET /api/v1/categories
// @access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // Category Exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error("دسته با این نام ساخته شده است");
  }
  // Create The Category
  const cateogry = await Category.create({ name: name?.toLowerCase(), user: req.userAuthId });
  res.status(201).json({ status: "Success", message: "دسته با موفقیت ساخته شد", cateogry });
});

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access Public
export const getCategoriesCtrl = asyncHandler(async (req, res) => {
  const books = await Category.find();
  res.status(200).json({ status: "Success", message: "دسته‌ها با موفقیت پیدا شدند", books });
});

// @desc   Get Single Category
// @route  GET /api/v1/categories/:categoryId
// @access Public
export const getCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    throw new Error("دسته با این مشخصات پیدا نشد");
  }
  res.status(200).json({ status: "Success", message: "دسته با موفقیت پیدا شد", category });
});

// @desc   Update Category
// @route  PUT /api/v1/books/update/:categoryId
// @access Private
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // Update
  const cateogry = await Category.findByIdAndUpdate(req.params.categoryId, { name }, { new: true });
  res.status(200).json({ status: "Success", message: "دسته با موفقیت بروزرسانی شد", cateogry });
});

// @desc   Delete Category
// @route  DELETE /api/v1/books/delete/:categoryId
// @access Private
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const categoryFound = await Category.findById(req.params.categoryId);
  if (!categoryFound) {
    throw new Error("دسته با این مشخصات پیدا نشد");
  }
  await Category.findByIdAndDelete(req.params.categoryId);
  res.status(200).json({ status: "Success", message: "دسته با موفقیت حذف شد" });
});