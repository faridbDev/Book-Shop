import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// Virtuals
// coupon is Expired
CouponSchema.virtual("isExpired", get(function() {
  return this.endDate < Date.now();
}));
// days left
CouponSchema.virtual("daysLeft", get(function() {
  return Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24));
}));

// Validations
CouponSchema.pre("validate", function(next) {
  if (this.endDate < this.startDate) {
    next(new Error("تاریخ پایان باید بزرگتر از تاریخ شروع باشد"));
  }
  next();
});
CouponSchema.pre("validate", function(next) {
  if (this.startDate < Date.now()) {
    next(new Error("تاریخ شروع باید بزرگتر از تاریخ امروز باشد"));
  }
  next();
});
CouponSchema.pre("validate", function(next) {
  if (this.endDate < Date.now()) {
    next(new Error("تاریخ پایان باید بزرگتر از تاریخ امروز باشد"));
  }
  next();
});
CouponSchema.pre("validate", function(next) {
  if (this.discount <= 0 || this.discount >100) {
    next(new Error("مقدار تخفیف باید بین اعداد صفر تا صد باشد"));
  }
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;