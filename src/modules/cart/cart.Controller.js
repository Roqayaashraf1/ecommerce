import {
  catchAsyncError
} from '../../middleWare/catchAsyncError.js';
import {
  AppError
} from '../../utilities/appError.js';
import {
  productModel
} from '../../../dataBase/models/product.model.js';
import {
  cartModel
} from '../../../dataBase/models/cart.model.js';

async function calcTotalPrice(cartItems) {
  let totalPrice = 0;
  let totalItems = 0;

  const newItems = cartItems.map((item) => {
    totalItems += item.quantity;
    const itemTotalPrice = item.price * item.quantity;
    totalPrice += itemTotalPrice;

    return {
      ...item
    };
  });

  return {
    totalPrice,
    newItems
  };
}
export const addToCart = catchAsyncError(async (req, res, next) => {
  const {
    product: productId,
    quantity = 1
  } = req.body;
  const product = await productModel.findById(productId);
  if (!product) return next(new AppError("Product not found", 401));

  if (product.quantity < quantity) {
    return next(new AppError("Insufficient product quantity", 400));
  }

  req.body.price = product.price;

  let cart = await cartModel.findOne({
    user: req.user._id
  });

  if (!cart) {
    cart = new cartModel({
      user: req.user._id,
      cartItems: [{
        ...req.body,
        quantity
      }],
    });
    const {
      totalPrice,
      newItems
    } = await calcTotalPrice(cart.cartItems);
    cart.cartItems = newItems;
    cart.totalPrice = totalPrice;
    await cart.save();
    return res.json({
      message: "success",
      result: cart
    });
  }

  const existingItem = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    if (product.quantity < existingItem.quantity + quantity) {
      return next(new AppError("Insufficient product quantity", 400));
    }
    existingItem.quantity += quantity;
  } else {
    if (product.quantity < quantity) {
      return next(new AppError("Insufficient product quantity", 400));
    }
    cart.cartItems.push({
      ...req.body,
      quantity
    });
  }

  const {
    totalPrice,
    newItems
  } = await calcTotalPrice(cart.cartItems);
  cart.cartItems = newItems;
  cart.totalPrice = totalPrice;
  await cart.save();

  res.json({
    message: "success",
    cart
  });
});
export const removeProductFromCart = catchAsyncError(async (req, res, next) => {
  let result = await cartModel.findOneAndUpdate({
    user: req.user._id
  }, {
    $pull: {
      cartItems: {
        _id: req.params.id
      }
    }
  }, {
    new: true
  });
  if (!result) return next(new AppError(`Item not found`, 401));

  const {
    totalPrice,
    newItems
  } = await calcTotalPrice(result.cartItems);
  result.cartItems = newItems;
  result.totalPrice = totalPrice;
  await result.save();

  res.json({
    message: "success",
    result
  });
});
export const updateQuantity = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id).select("price");
  if (!product) return next(new AppError("Product not found", 401));

  let cart = await cartModel.findOne({
    user: req.user._id
  });
  let item = cart.cartItems.find((elm) => elm.product.toString() === req.params.id);
  if (item) {
    item.quantity = req.body.quantity;
  }

  const {
    totalPrice,
    newItems
  } = await calcTotalPrice(cart.cartItems);
  cart.cartItems = newItems;
  cart.totalPrice = totalPrice;
  await cart.save();

  res.json({
    message: "success",
    cart
  });
});

export const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel
    .findOne({
      user: req.user._id
    })
    .populate('cartItems.product');

  if (!cart) return next(new AppError("Cart not found", 404));

  const {
    totalPrice,
    newItems
  } = await calcTotalPrice(cart.cartItems);
  cart.cartItems = newItems;
  cart.totalPrice = totalPrice;

  res.status(200).json({
    message: "success",
    cart
  });
});