import { Router } from "express";
import { getUser, getRanking } from "../controller/usersController.js";

export const userRouter = Router();

userRouter.get('/users/me', getUser);
userRouter.get('/ranking', getRanking);


export default userRouter