import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "product" },
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: Number,
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("cart", cartSchema);
