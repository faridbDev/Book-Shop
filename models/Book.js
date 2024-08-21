import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    writer: {
      type: String,
      required: true
    },
    translator: {
      type: String
    },
    publishedYear: {
      type: Number,
      required: true
    },
    images: [
      {
        data: Buffer,
        contentType: String
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    categories: {
      type: [String],
      required: true
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    price: {
      type: Number,
      required: true
    },
    totalQty: {
      type: Number,
      required: true
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// Virtuals
// QTY left
BookSchema.virtual("qtyLeft").get(function() {
  return this.totalQty - this?.totalSold;
});
// Total Reviews
BookSchema.virtual("totalReviews").get(function() {
  return this?.reviews?.length;
});
// Average Rating
BookSchema.virtual("averageRating").get(function() {
  let ratingsTotal = 0;
  this.reviews?.forEach((review) => {
    ratingsTotal += review?.rating;
  });
  return Number(ratingsTotal / this.reviews?.length).toFixed(1);
});

// adding virtuals to return object when we use lean()
BookSchema.plugin(mongooseLeanVirtuals);

const Book = mongoose.model("Book", BookSchema);

export default Book;