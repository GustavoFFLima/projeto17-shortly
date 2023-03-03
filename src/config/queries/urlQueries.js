import { db } from "../database.js";

const shortUrl = {
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