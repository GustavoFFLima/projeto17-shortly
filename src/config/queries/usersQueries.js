import { db } from "../database.js";

const users = {
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