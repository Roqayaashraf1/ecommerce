import express from "express";
import * as user from "./user.Controller.js";
import {
  protectRoutes
} from "../auth/auth.Controller.js";

const userRouter = express.Router();

userRouter
  .route("/:id")
  .get(protectRoutes, user.getuser)

export {
  userRouter
};