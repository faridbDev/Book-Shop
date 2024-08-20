import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Generate Random ID for the order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);

const OrderSchema = new Schema(
  {
    orderItems: [
      {
        type: Object,
        required: true
      }
    ],
    orderNumber: {
      type: String,
      required: true,
      default: randomTxt + randomNumbers
    },
    totalPrice: {
      type: Number,
      default: 0.0
    },
    shippingAddress: {
      type: Object,
      required: true
    },
    paymentStatus: {
      type: String,
      default: "پرداخت نشده"
    },
    deliveredAt: {
      type: Date
    },
    status: {
      type: String,
      default: "در دست بررسی",
      enum: ["در دست بررسی", "در حال انجام", "ارسال شده", "تحویل شده"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;