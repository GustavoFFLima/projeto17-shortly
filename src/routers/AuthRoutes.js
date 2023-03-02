import { signIn, signUp } from "../controller/AuthRouter.js"
import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.js"
import { SignUpSchema } from '../schemas/SignUpSchema.js'
import { SignInSchema } from '../schemas/SignInSchema.js'

const authRouter = Router()

// Rotas de autenticação
authRouter.post("/signup", validateSchema(SignUpSchema), signUp)
authRouter.post("/signin", validateSchema(SignInSchema) , signIn)

export default authRouter