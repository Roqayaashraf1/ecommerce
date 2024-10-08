import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategory,
} from "./category.Controller.js";

const categoryRouter = express.Router();
categoryRouter
  .route("/")
  .post(
    createCategory
  )
  .get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(getCategory)


export { categoryRouter };
