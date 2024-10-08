import {
  catchAsyncError
} from "../../middleWare/catchAsyncError.js";
import {
  AppError
} from "../../utilities/appError.js";
import {
  userModel
} from "../../../dataBase/models/user.model.js";


export const getuser = catchAsyncError(async (req, res, next) => {
  const {
    id
  } = req.params;
  let result = await userModel.findById(id);
  !result && next(new AppError(`user not found`, 404));
  result && res.json({
    message: "success",
    result
  });
});


