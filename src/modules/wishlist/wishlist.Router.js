import express from "express";
const wishlistrouter = express.Router();
import * as wishlist from "./wishlist.Controller.js";
import {
  protectRoutes
} from "../auth/auth.Controller.js";

wishlistrouter.use(protectRoutes);

wishlistrouter.route('/:product')
  .delete(wishlist.removeProductFromWishlist)
  .post(wishlist.addToWishlist)

wishlistrouter.route('/')
  .get(wishlist.getLoggedUserWishlist);

export {
  wishlistrouter
};