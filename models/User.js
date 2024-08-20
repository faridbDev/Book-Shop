import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    hasShippingAddress: {
      type: Boolean,
      default: false
    },
    shippingAddress: {
      firstName: { type: String},
      lastName: { type: String},
      address: { type: String},
      city: { type: String},
      postalCode: { type: String},
      phoneNumber: { type: String}
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order"
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;