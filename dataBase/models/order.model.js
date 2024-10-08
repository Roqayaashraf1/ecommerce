import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: Number,
    shippingAddress: {
      street: String,
      city: String,
      phone: String,
      country: String,
      building: String,
      area: String,
      floor: Number,
      apartment: Number,
    }
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
