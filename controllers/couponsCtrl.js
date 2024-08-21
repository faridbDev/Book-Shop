import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";

// @desc   Create New Coupon
// @route  POST /api/v1/coupons
// @access Private/Admin
export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // Check If Coupons Already Exists
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    throw new Error("این کد تخفیف قبلا ساخته شده است");
  }
  // Check If the Discount is A Number
  if (isNaN(discount)) {
    throw new Error("کد تخفیف باید به صورت عدد وارد شود");
  }
  // Create Coupon
  const coupon = await Coupon.create({ code: code?.toUpperCase(), startDate, endDate, discount, user: req.userAuthId });
  res.status(200).json({ status: "Success", message: "کد تخفیف با موفقیت ساخته شد", coupon });
});

// @desc   Get All Coupons
// @route  GET /api/v1/coupons
// @access Private/Admin
export const getCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({ status: "Success", message: "کدهای تخفیف با موفقیت پیدا شدند", coupons });
});

// @desc   Get Single Coupon
// @route  GET /api/v1/coupons/single?code=x
// @access Private/Admin
export const getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req?.query.code});
  // Check If Coupon exists
  if (coupon === null) {
    throw new Error("کد تخفیف پیدا نشد");
  }
  // Check If Coupon is Expired
  if (coupon.isExpired) {
    throw new Error("تاریخ کد تخفیف به پایاند رسیده است");
  }
  res.status(200).json({ status: "success", message: "کد تخفیف با موفقیت پیدا شد", coupon });
});

// @desc   Update Coupon
// @route  PUT /api/v1/coupons/update/:couponId
// @access Private/Admin
export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // update
  const coupon = await Coupon.findByIdAndUpdate(req.params.couponId, { code: code?.toUpperCase(), discount,
  startDate, endDate }, { new: true });
  res.status(200).json({ status: "success", message: "کد تخفیف با موفقیت بروزرسانی شد", coupon });
});

// @desc   Delete Coupon
// @route  DELETE /api/v1/coupons/delete/:couponId
// @access Private/Admin
export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  const couponFound = await Coupon.findById(req.params.couponId);
  if (!couponFound) {
    throw new Error("کد تخفیف پیدا نشد");
  }
  await Coupon.findByIdAndDelete(req.params.couponId);
  res.status(200).json({ status: "success", message: "کد تخفیق با موفقیت حذف شد"});
});