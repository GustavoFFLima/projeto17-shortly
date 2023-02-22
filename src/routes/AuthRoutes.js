import { signIn, signUp } from "../controller/Auth.js"
import { Router } from "express"

const authRouter = Router()

// Rotas de autenticação
authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)

export default authRouter