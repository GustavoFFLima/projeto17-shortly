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
      
      if (checkUrl.rows < 1) return res.sendStatus(404);
      const { id, url, short } = checkUrl.rows[0]
      console.log(id, url, short )
      return res.send({id, shortUrl:short, url});

    } catch (error) {
      res.status(500).send(error.message);
    }
  }

export async function redirectUrl (req, res) {
    const identification = req.params.shortUrl;
    try{
      const redirectUrl = await db.query(`SELECT * FROM url WHERE "id"=$1`,[identification])
      
      if(redirectUrl.rows === 0) return res.sendStatus(404)

      const upVisits = redirectUrl.rows[0].visitCount +1
      const abobrinha = await db.query(`UPDATE url SET "visitCount" = $1 WHERE "id" = $2`, [upVisits, identification])
      console.log( redirectUrl.rows[0].url)
      return res.redirect( redirectUrl.rows[0].url)

    } catch (error) {
      return res.status(500).send(error.message);
    }
}

export async function deleteUrl (req, res) {
    const { authorization: bearerToken } = req.headers
      
    const authToken = bearerToken.replace("Bearer ", "")
    if(!authToken) return res.status(401).send("token não informado");

    const { id } = req.params;
    const { userId } = res.locals;
    try {
      const deleteUrl = await db.query('DELETE FROM url WHERE id = $1', [id])
      const selecUrl = await db.query(`SELECT * FROM url WHERE id=$1;`, [id]);
      if (selecUrl.rowCount < 1) return res.sendStatus(404)
      if(userId !== selecUrl.rows[0].userId) {
          return res.sendStatus(401)

      }else{
        return res.status(204).send(deleteUrl)
      }    
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
