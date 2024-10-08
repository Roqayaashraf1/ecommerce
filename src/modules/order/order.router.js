import express from "express";
import {
  createCashOrder,
  getSpecificOrder
} from "./order.controller.js";
import {
  protectRoutes
} from "../auth/auth.Controller.js";

const orderRouter = express.Router();
orderRouter.route("/").get(protectRoutes, getSpecificOrder);

orderRouter
  .route("/:id")
  .post(protectRoutes, createCashOrder)


export {
  orderRouter
};