import Jwt from "jsonwebtoken";
import {
  catchAsyncError
} from "../../middleWare/catchAsyncError.js";
import {
  userModel
} from "../../../dataBase/models/user.model.js";
import {
  AppError
} from "../../utilities/appError.js";
import bcrypt from "bcrypt";
export const signup = catchAsyncError(async (req, res, next) => {
  let isFound = await userModel.findOne({
    email: req.body.email
  });
  if (isFound) return next(new AppError("email already exists", 409));
  let user = new userModel(req.body);
  await user.save();
  res.json({
    message: "success",
    user
  });
});

export const signin = catchAsyncError(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  let isFound = await userModel.findOne({
    email
  });
  if (!isFound) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const match = await bcrypt.compare(password, isFound.password);
  if (match) {
    let token = Jwt.sign({
        name: isFound.name,
        userId: isFound._id,
        role: isFound.role
      },
      "mynameisRoqaya", {
        expiresIn: "1d"
      }
    );
    return res.json({
      message: "success",
      token
    });
  }
  next(new AppError("incorrect email or password", 401));
});


export const protectRoutes = catchAsyncError(async (req, res, next) => {
  let {
    token
  } = req.headers;

  if (!token) return next(new AppError("Token not provided", 401));

  let decoded = Jwt.verify(token, "mynameisRoqaya");

  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new AppError("User not found"));
  req.user = user;
  next();
});