
import slugify from "slugify";
import {
  productModel
} from "../../../dataBase/models/product.model.js";
import {
  catchAsyncError
} from "../../middleWare/catchAsyncError.js";
import {
  APIFeatures
} from "../../utilities/APIFeatures.js";
import {
  AppError
} from "../../utilities/appError.js";





export const createproduct = catchAsyncError(async (req, res) => {

  req.body.image = req.file.filename;
  const {
    title,
    description,
    price,
    quantity,
    category
  } = req.body;

  req.body.slug = slugify(title);
  let result = new productModel(req.body);
  console.log(result)

  await result.save();
  res.json({
    message: "success",
    result
  });
});

export const getAllproducts = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(
    productModel.find()
      .populate('category'),
    req.query
  ).filter()
    .search();
  const totalProducts = await productModel.countDocuments(apiFeatures.mongooseQuery.getFilter());

  const totalPages = Math.ceil(totalProducts / 20);
  apiFeatures.paginate().sort().selectedFields();

  let result = await apiFeatures.mongooseQuery;

  try {
    res.json({
      message: "success",
      totalProducts,
      totalPages,
      page: apiFeatures.page,
      result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error converting currency",
      error,
    });
  }
});




export const getproduct = catchAsyncError(async (req, res, next) => {
  const {
    id
  } = req.params;
  let result = await productModel.findById(id)
    .populate('category')
  if (!result) return next(new AppError("Product not found", 404));


  res.json({
    message: "success",
    result
  });
});

export const search = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(productModel.find(), req.query)
    .filter()
    .selectedFields()
    .search()
    .sort();

  let result = await apiFeatures.mongooseQuery;
  try {
    res.json({
      message: "success",
      page: apiFeatures.page,
      result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error converting currency",
      error
    });
  }
});




