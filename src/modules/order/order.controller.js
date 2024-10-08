import {
  productModel
} from "../../../dataBase/models/product.model.js";
import {
  cartModel
} from "../../../dataBase/models/cart.model.js";

import {
  catchAsyncError
} from "../../middleWare/catchAsyncError.js";
import {
  AppError
} from "../../utilities/appError.js";
import {
  orderModel
} from "../../../dataBase/models/order.model.js";
import sendEmail from "../../utilities/sendEmail.js";
import {
  userModel
} from "../../../dataBase/models/user.model.js";

export const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id).populate("cartItems.product");
  if (!cart) return next(new AppError("Cart not found", 404));
  const user = await userModel.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));
  const {
    shippingAddress
  } = req.body;
  const cartItems = cart.cartItems.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.price,
  }));
  const order = new orderModel({
    user: req.user._id,
    cartItems: cartItems,
    totalPrice: cart.totalPrice,
    shippingAddress,
  });
  await order.save();

  if (order) {
    const options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product._id
        },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: item.quantity
          }
        },
      },
    }));
    await productModel.bulkWrite(options);
    await cartModel.findByIdAndDelete(req.params.id);

    const {
      street,
      building,
      area,
      floor,
      apartment,
      city,
      phone,
      country
    } = shippingAddress;
    const emailSubject = "Your Order Details";
    const emailMessage = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order, ${user.name}</p>
      <p><strong>Total Price </strong> ${totalPrice.toFixed(2)}</p>
      <p><strong>Shipping Address:</strong><br>
        Street: ${street}<br>
        Building: ${building}<br>
        Area: ${area}<br>
        Floor: ${floor}<br>
        Apartment: ${apartment}<br>
        City: ${city}<br>
        Phone: ${phone}<br>
        Country: ${country}
      </p>
    `;
    try {
      const emailSent = await sendEmail({
        to: req.user.email,
        subject: emailSubject,
        message: emailMessage,
      });

      if (!emailSent) {
        console.error("Failed to send order confirmation email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        message: "Failed to send order confirmation email",
        error
      });
    }
  }

  res.json({
    message: "Order created successfully",
    order
  });
});

export const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel
    .find({
      user: req.user._id
    })
    .populate("cartItems.product");

  const ordersonly = orders.map((order) => {
    const cartItems = order.cartItems.map((item) => ({
      ...item._doc,
      price: item.price,
    }));

    return {
      ...order._doc,
      cartItems: cartItems,
      totalPrice: order.totalPrice,
    };
  });

  res.status(200).json({
    message: "success",
    orders: ordersonly
  });
});