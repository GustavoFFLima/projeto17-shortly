import { db } from "../config/database.js";

export async function getUser (req, res) {
    const { id } = res.locals;
    const { authorization: bearerToken } = req.headers
      
    const authToken = bearerToken.replace("Bearer ", "")
    if(!authToken) return res.status(401).send("token não informado")

    try {
      const userInfo = await db
        .query(
          `
          SELECT 
  users.id AS "id", 
  users.name AS "name", 
  SUM(url."visitCount") AS "visitCount", 
  ARRAY(
    SELECT JSON_BUILD_OBJECT(
      'id', url.id,
      'short', url."short",
      'url', url.urL,
      'visitCount', url."visitCount"
    )
    FROM url
    WHERE url."userId" = users.id
  ) AS "shortenedUrls"
FROM url
JOIN users ON url."userId" = users.id
WHERE users.id = $1
GROUP BY users.id, users.name;
          `,
          [id]
        );
        console.log(userInfo.rows)
      return res.status(200).send(userInfo.rows[0]);
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

