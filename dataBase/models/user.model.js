import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "user name required"],
    minLength: [2, "too short user name"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "email required"],
    minLength: 1,
    unique: [true, "email must be required"],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "minimum length 6 characters"],
  }
}, {
  timestamps: true
});
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 7);
});


export const userModel = mongoose.model("user", userSchema);