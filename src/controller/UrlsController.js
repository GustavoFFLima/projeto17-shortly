import { nanoid } from "nanoid";
import shortUrl from "../config/queries/urlQueries.js";

export async function shorten (req, res) {
    const { url } = req.body;
    const { userId } = res.locals;
    const identification = nanoid();
    try {
      const { success, id, error } = await shortUrl.create({
        url,
        shortUrl: identification,
        userId
      });
      if (!success) {
        return res.sendStatus(500);
      }
      return res.sendStatus(201);
    } catch (error) {
      return res.sendStatus(500);
    }
  }

export async function getShortUrlById (req, res) {
    const { id } = req.params;
    try {
      const { success, url, error } = await shortUrl.getById(id);
      if (!success) {
        res.sendStatus(500);
      }
      if (!url) res.sendStatus(404);
      return res.send(url);
    } catch (error) {
      res.sendStatus(500);
    }
  }

export async function redirectShortUrl (req, res) {
    const identification = req.params.shortUrl;
    try {
      const { success, url, error } = await shortUrl.getByShortUrl(identification);
      if (!success) {
        return res.sendStatus(500);
      }
      if (!url) return res.sendStatus(404);
      const { success: incrementSuccess, error: incrementError } = await shortUrl.incrementVisitsCountById(url.id);
      if (!incrementSuccess) {
        return res.sendStatus(500);
      }
      return res.redirect(url.url);
    } catch (error) {
      return res.sendStatus(500);
    }
  }

export async function deleteShortUrl (req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    try {
      const { success, url, error } = await shortUrl.getById(id);
      if (!success) {
        return res.sendStatus(500);
      }
      if (!url) return res.sendStatus(404);
      if (url.userId !== userId) return res.sendStatus(401);
      const { success: deleteSuccess, error: deleteError } = await shortUrl.delete(id);
      if (!deleteSuccess) {
        return res.sendStatus(500);
      }
      return res.sendStatus(204);
    } catch (error) {

    }
  }
