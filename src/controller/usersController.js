import users from "../config/queries/usersQueries.js";

export async function getUser (req, res) {
    const { userId } = res.locals;
    try {
      const { rows: [userInfo] } = await db
        .query(
          `
          SELECT users.id, users.name, SUM("visitsCount") AS "visitCount"
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
        SELECT id, "shortUrl", url, "visitsCount" AS "visitCount" 
        FROM url
        WHERE "userId" = $1
        ORDER BY id ASC
        `,
          [id]
        );
      const { success, user, error } = userId;
      if (!success) {
        return res.status(500).send('DB com problema');
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send('Problema no servidor');
    }
  }
  
export async function getRanking (req, res) {
    try {
      const { success, ranking, error } = await users.rankingByVisits();
      if (!success) {
        return res.status(500).send('DB com problema');
      }
      return res.send(ranking);
    } catch (error) {
      return res.status(500).send('Problema no servidor');
    }
}
