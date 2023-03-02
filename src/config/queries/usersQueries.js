import { db } from "../database.js";

const users = {
  getById: async (id) => {
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
      return { success: true, user: { ...userInfo, shortenedUrls }, error: undefined };
    } catch (error) {
      return { success: false, user: undefined, error };
    }
  },
  rankingByVisits: async () => {
    try {
      const { rows: ranking } = await db
        .query(`
          SELECT users.id, users.name, SUM("visitsCount") as "visitCount", COUNT("shortUrl") AS "linksCount" 
          FROM users
          JOIN url
            ON url."userId" = users.id
          GROUP BY users.id
          ORDER BY "visitCount" DESC
          LIMIT 10;
      `);
      return { success: true, ranking, error: undefined };
    } catch (error) {
      return { success: false, ranking: undefined, error };
    }
  }
};

export default users;