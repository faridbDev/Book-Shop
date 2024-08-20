import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    Books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book"
      }
    ]
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;