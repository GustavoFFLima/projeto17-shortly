import { db } from "../database.js";

const shortUrl = {
  create: async ({ url, shortUrl, userId }) => {
    try {
      const { rows: [{ id }] } = await db
        .query(
          'INSERT INTO "url" ("shortUrl", url, "userId") values ($1, $2, $3) RETURNING id',
          [shortUrl, url, userId]
        );
      return { success: true, id, error: undefined };
    } catch (error) {
      return { success: false, id: undefined, error };
    }
  },
  getById: async (id) => {
    try {
      const { rows: [url] } = await db.query('SELECT id, "shortUrl", url, "userId" FROM url WHERE id = $1', [id]);
      return { success: true, url, error: undefined };
    } catch (error) {
      return { success: false, url: undefined, error };
    }
  },
  getByShortUrl: async (identifier) => {
    try {
      const { rows: [url] } = await db.query('SELECT id, url FROM url WHERE "shortUrl" = $1', [identifier]);
      return { success: true, url, error: undefined };
    } catch (error) {
      return { success: false, url: undefined, error };
    }
  },
  incrementVisitsCountById: async (id) => {
    try {
      await db.query('UPDATE url SET "visitsCount" = "visitsCount" + 1 WHERE id = $1', [id]);
      return { success: true, error: undefined };
    } catch (error) {
      return { success: false, error };
    }
  },
  delete: async (id) => {
    try {
      await db.query('DELETE FROM url WHERE id = $1', [id]);
      return { success: true, error: undefined };
    } catch (error) {
      return { success: false, error };
    }
  }
};

export default shortUrl;