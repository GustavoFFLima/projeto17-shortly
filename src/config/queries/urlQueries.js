import { db } from "../database.js";

const shortUrl = {

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