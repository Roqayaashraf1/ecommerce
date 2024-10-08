import express from "express";
import * as cart from "./cart.Controller.js";
import {
  protectRoutes
} from "../auth/auth.Controller.js";

const cartRouter = express.Router();


cartRouter.route("/")
  .post(protectRoutes, cart.addToCart)
  .get(protectRoutes, cart.getLoggedUserCart);

cartRouter.route("/:id")
  .delete(protectRoutes,  cart.removeProductFromCart)
  .put(protectRoutes,  cart.updateQuantity)

export {
  cartRouter
};