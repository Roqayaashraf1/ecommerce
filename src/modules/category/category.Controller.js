import { categoryModel } from "../../../dataBase/models/category.model.js";
import slugify from "slugify";
import { AppError } from "../../utilities/appError.js";
import * as factory from "../handlers/factor.handler.js";
import { APIFeatures } from "../../utilities/APIFeatures.js";
import { catchAsyncError } from "../../middleWare/catchAsyncError.js";
import { productModel } from "../../../dataBase/models/product.model.js";

export const createCategory = catchAsyncError(async (req, res) => {
  try {
    const { title } = req.body;

    let result = new categoryModel({
      title,
      slug: slugify(title),
    });

    await result.save();
    res.json({
      message: "success",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating category",
      error: error.message,
    });
  }
});

export const getAllCategories = catchAsyncError(async (req, res, next) => {
  try {
    let apiFeatures = new APIFeatures(categoryModel.find(), req.query)
      .filter()
      .selectedFields("title slug")
      .search()
      .sort();

    let result = await apiFeatures.mongooseQuery;

    res.status(200).json({
      message: "success",
      page: apiFeatures.page,
      result,
    });
  } catch (error) {
    next(error);
  }
});
export const getCategory = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id).select("title slug");
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    const products = await productModel.find({ category: id });

    res.json({
      message: "success",
      category,
      products,
    });
  } catch (error) {
    next(error);
  }
});
export const UpdateCategories = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  let result = await categoryModel.findByIdAndUpdate(
    id,
    {
      title,
      slug: slugify(title),
    },
    { new: true }
  );
  !result && next(new AppError("Category not found", 404));
  result && res.json({
    message: "success",
    result,
  });
});
export const deleteCategories = factory.deleteOne(categoryModel);
