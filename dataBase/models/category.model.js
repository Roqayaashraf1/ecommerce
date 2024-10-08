import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const categoryModel = mongoose.model("category", categorySchema);
