import { Router } from "express";
import { getUser, getRanking } from "../controller/usersController.js";
import { validateToken } from "../middlewares/validateToken.js";

export const userRouter = Router();

userRouter.get('/users/me', validateToken, getUser);
userRouter.get('/ranking', getRanking);