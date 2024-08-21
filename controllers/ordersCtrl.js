import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";
import ZarinpalPayment from "zarinpal-pay";
import dotenv from "dotenv";
dotenv.config();

// zarinpal instance
const zarinpal = new ZarinpalPayment (process.env.ZARINPAL_KEY);

// @desc   Create New Order
// @route  GET /api/v1/orders
// @access Public
export const createOrderCtrl = asyncHandler(async (req, res) => {
  // Get The Coupon (Its Optional)
  const { coupon } = req?.query;
  
  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });
  if (couponFound?.isExpired) {
    throw new Error("تاریخ کد تخفیف به اتمام رسیده است");
  }
  if (!couponFound) {
    throw new Error("کد تخفیف با این نام وجود ندارد");
  }
  // Get Discount
  const discount = couponFound?.discount / 100;

  const { orderItems, shippingAddress, totalPrice } = req.body;
  // Find The User
  const user = await User.findById(req.userAuthId);
  // Check If User Has Shipping Address
  if (!user?.hasShippingAddress) {
    throw new Error("لطفا آدرس ارسالی را مشخص کنید")
  }
  // Check If Order Is Not Empty
  if (orderItems?.length <= 0) {
    throw new Error("سفارسی در سبد خرید شما وجود ندارد");
  }
  // Create Order 
  const order = await Order.create({ user: user?._id, orderItems, shippingAddress,
  totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice });

  // Update The Book Qty
  const books = await Book.find({ _id: { $in: orderItems }});
  orderItems?.map(async (order) => {
    const book = books?.find((book) => {
      return book?._id?.toString() === order?._id.toString();
    });
    if (book) {
      book.totalSold += order.qty;
    }
    await book.save();
  });

  //Push Order Into User And Save
  user.orders.push(order?._id);
  await user.save();

  // make payment (Zarinpal)
  await zarinpal.create({
    amount: Number(order?.totalPrice),
    description: order?.orderItems[0]?.name,
    callback_url: `http://localhost:7000/api/v1/orders/verifyorder?orderId=${order?._id}`,
    mobile: "09196513578",
    email: "book-shop@gmail.com",
    // order_id: toString(order.orderNumber)
  })
  .then(result => {
    res.send({ url: result.data.link})
  });
});

// @desc   Verify Orders(Zarinpal)
// @route  GET /api/v1/orders/verifyorder?orderId=x
// @access Public
export const verifyOrderCtrl = asyncHandler(async (req, res) => {
  console.log("A1: ", req.query.orderId);
  const orderId = req.query.orderId;
  // Find The Order
  const orderFound = await Order.findById(orderId);
  // Check If Order Exists
  if (!orderFound) {
    throw new Error("در هنگام پرداخت مشکلی به وجود آمده است");
  }
  // Find The User
  const user = await User.findById(orderFound?.user?.toHexString());
  // Get The Ordered Books for Updating If Payment Process Failed
  const books = await Book.find({ _id: { $in: orderFound?.orderItems }});
  console.log("A2: ", req.query.Status);
  if (req.query.Status === 'OK') {
    await zarinpal.verify({
      authority: req.query.Authority,
      amount: orderFound.totalPrice
    })
    .then(async (result) => {
      if (result.data.code === 100 || result.data.code === 101) {
        await Order.findByIdAndUpdate(orderId,{ paymentStatus: "پرداخت شده" }, { new: true });
        // res.redirect('http://localhost:3000/success');
        res.send("تراکنش با موفقیت انجام شد");
      } else {
        // Update The Book Qty Back To What it was
        orderFound?.orderItems?.map(async (order) => {
          const book = books?.find((book) => {
            return book?._id?.toString() === order?._id?.toString();
          });
          if (book) {
            book.totalSold -= order.qty;
          }
          await book.save();
        });
        // Delete The Order From User And Save
        user.orders.pop();
        await user.save();
        // Delete The Order
        await Order.findByIdAndDelete(orderId);
        res.send("Payment Process Confronted With Problem. Not Verified.");
      }
    });
  } else {
    // Update The Book Qty Back To What it was
    orderFound?.orderItems?.map(async (order) => {
      const book = books?.find((book) => {
        return book?._id?.toString() === order?._id?.toString();
      });
      if (book) {
        book.totalSold -= order.qty;
      }
      await book.save();
    });
    // Delete The Order From User And Save
    user.orders.pop();
    await user.save();
    // Delete The Order
    await Order.findByIdAndDelete(orderId);
    res.send("Payment Process Confronted With Problem. NOK");
  }
});

// @desc   Get All Orders
// @route  GET /api/v1/orders
// @access Private/Admin
export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json({ status: "success", message: "سفارش‌ها با موفقیت پیدا شدند", orders });
});

// @desc   Get Single Order
// @route  GET /api/v1/orders/:orderId
// @access Private/Admin
export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  res.json({ status: "success", message: "سفارش با موفقیت پیدا شد", order });
});

// @desc   Update Order To Delivered
// @route  GET /api/v1/orders/update/:orderId
// @access Private/Admin
export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status }, { new: true });
  res.json({ status: "success", message: "سفارش با موفقیت بروزرسانی شد", updatedOrder });
});

// @desc   Get Sales Stats
// @route  GET /api/v1/orders/sales/stats
// @access Private/Admin
export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  // Get Orders Statistics
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice"
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice"
        }
      }
    }
  ]);
  
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today
        }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice"
        }
      }
    }
  ]);

  res.status(200).json({ status: "success", message: "آمار سفارشها با موفقیت پیدا شدند", orders, salesToday });
});