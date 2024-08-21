import express from "express";
import { createCouponCtrl, getCouponsCtrl, getCouponCtrl, updateCouponCtrl, deleteCouponCtrl } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAdmin } from '../middlewares/isAdmin.js';

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);

couponsRouter.get("/", getCouponsCtrl);

couponsRouter.get("/single", getCouponCtrl);

couponsRouter.put("/update/:couponId", isLoggedIn, isAdmin, updateCouponCtrl);

couponsRouter.delete("/delete/:couponId", isLoggedIn, isAdmin, deleteCouponCtrl);

export default couponsRouter;