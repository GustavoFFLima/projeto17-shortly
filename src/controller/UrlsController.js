import { nanoid } from "nanoid";
import { db } from "../config/database.js";

export async function shorten (req, res) {
  const { url } = req.body;
  const identification = nanoid();
  const { authorization: bearerToken } = req.headers
    
  const authToken = bearerToken.replace("Bearer ", "")
  if(!authToken) return res.status(401).send("token não informado");

    try{
        const session = await db.query(`SELECT * FROM sessions WHERE "userToken"=$1`,[authToken])

        if(session.rowCount === 0) return res.status(401).send("Faça login novamente")

        await db.query(`INSERT INTO url ("short", url, "userId", "visitCount") VALUES ($1,$2,$3, 0)`, [identification, url, session.rows[0].userId])

        const urlId = await db.query(`SELECT * FROM url WHERE "short"=$1`,[identification])

        res.status(201).send({
            id: urlId.rows[0].id,
            shortUrl: identification
        })
    }catch(error){
        res.status(500).send(error.message)
    }
  }

export async function getUrlById (req, res) {
    const reqUrlId = req.params.id;
    try {
      const checkUrl = await db.query('SELECT * FROM url WHERE id = $1', [reqUrlId]);
    
      const { id, userId, url, shotUrl:short, visitCount, createdAt } = checkUrl.rows[0]
      if (checkUrl.rows === 0) return res.sendStatus(404);
      return res.send({id, shotUrl, url});

    } catch (error) {
      res.status(500).send(error.message);
    }
  }

export async function redirectUrl (req, res) {
    const identification = req.params.shortUrl;
    try {
      const { success, url, error } = await shortUrl.getByShortUrl(identification);
      if (!success) {
        return res.sendStatus(500);
      }
      if (!url) return res.sendStatus(404);
      const { success: incrementSuccess, error: incrementError } = await shortUrl.incrementVisitsCountById(url.id);
      if (!incrementSuccess) {
        return res.sendStatus(500);
      }
      return res.redirect(url.url);
    } catch (error) {
      return res.sendStatus(500);
    }
  }

export async function deleteUrl (req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    try {
      const { success, url, error } = await shortUrl.getById(id);
      if (!success) {
        return res.sendStatus(500);
      }
      if (!url) return res.sendStatus(404);
      if (url.userId !== userId) return res.sendStatus(401);
      const { success: deleteSuccess, error: deleteError } = await shortUrl.delete(id);
      if (!deleteSuccess) {
        return res.sendStatus(500);
      }
      return res.sendStatus(204);
    } catch (error) {

    }
  }
