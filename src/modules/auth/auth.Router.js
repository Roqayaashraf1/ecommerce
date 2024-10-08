import express from "express";

import * as auth from "./auth.Controller.js";
const authRouter = express.Router();

authRouter.post("/signup" , auth.signup);
authRouter.post("/signin", auth.signin);

export { authRouter };
