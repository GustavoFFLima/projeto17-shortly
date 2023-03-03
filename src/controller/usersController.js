import { db } from "../config/database.js";

export async function getUser (req, res) {
    const { id } = res.locals;
    const { authorization: bearerToken } = req.headers
      
    const authToken = bearerToken.replace("Bearer ", "")
    if(!authToken) return res.status(401).send("token não informado")

    try {
      const { rows: [userInfo] } = await db
        .query(
          `
          SELECT users.id, users.name, SUM("visitCount") AS "visitCount"
          FROM users
          JOIN url
            ON url."userId" = users.id
          WHERE users.id = $1
          GROUP BY users.id
          `,
          [id]
        );
      const { rows: shortenedUrls } = await db
        .query(
          `
        SELECT id, "shortUrl", url, "visitCount" AS "visitCount" 
        FROM url
        WHERE "userId" = $1
        ORDER BY id ASC
        `,
          [id]
        );
      return res.status(200).send(userInfo, shortenedUrls);
    } catch (error) {
      return res.status(500).send(error.message);
  }
}

export async function getRanking (req, res) {
    try {
    } catch (error) {
      return res.status(500).send('Problema no servidor');
    }
}

