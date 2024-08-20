import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

// @desc Register User
// @route POST /api/v1/users/register
// @access Public
export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  // Check If User Exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("این ایمیل قبلا استفاده شده است");
  }
  // Hash Entered Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create User
  const user = await User.create({ fullname, email, password: hashedPassword });
  res.status(201).json({ status: "Success", message: "ثبت نام با موفقیت انجام شد", data: user });
});

// @desc Login User
// @route POST /api/v1/users/login
// @access Public
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Find The User
  const userFound = await User.findOne({ email });
  if (userFound && await bcrypt.compare(password, userFound?.password)) {
    res.status(200).json({ status: "Success", message: "شما با موفقیت وارد شدید", token: generateToken(userFound?._id),
    userFound });
  } else {
    throw new Error("اطلاعات وارد شده اشتباه است");
  }
});

// @desc Get User Profile
// @route GET /api/v1/users/profile
// @access Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  // .populate("orders")
  const user = await User.findById(req.userAuthId);
  res.status(200).json({ status: "Success", message: "مشخصات کاربر با موفقیت پیدا شد", user });
});