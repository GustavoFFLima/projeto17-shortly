import { Router } from "express"
import { shorten, getShortUrlById, redirectShortUrl, deleteShortUrl } from "../controller/UrlsController.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { urlSchemas } from "../schemas/urlSchema.js"

export const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchema(urlSchemas), shorten)
urlRouter.get('/urls/:id', getShortUrlById)
urlRouter.get('/urls/open/:shortUrl', redirectShortUrl)
urlRouter.delete('/urls/:id', deleteShortUrl)

export default urlRouter