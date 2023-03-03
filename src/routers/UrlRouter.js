import { Router } from "express"
import { shorten, getUrlById, redirectUrl, deleteUrl } from "../controller/UrlsController.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { urlSchemas } from "../schemas/urlSchema.js"

export const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchema(urlSchemas), shorten)
urlRouter.get('/urls/:id', getUrlById)
urlRouter.get('/urls/open/:shortUrl', redirectUrl)
urlRouter.delete('/urls/:id', deleteUrl)

export default urlRouter