import { db } from "../config/database.js";

export async function getUser (req, res) {
    const { authorization: bearerToken } = req.headers
    if(!bearerToken) return res.sendStatus(401)
    const authToken = bearerToken.replace("Bearer ", "")

    try {
      // const session = await db.query(`SELECT * FROM sessions WHERE "userToken"=$1`, [authToken])
      //   if(session.rows == 0) return res.sendStatus(401)
      const userInfo = await db.query(
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
      return res.status(200).send(userInfo.rows[0]);
    } catch (error) {
      return res.status(500).send(error.message);
  }
}

export async function getRanking (req, res) {
    try {
    } catch (error) {
      return res.status(500).send(error.message);
    }
}

