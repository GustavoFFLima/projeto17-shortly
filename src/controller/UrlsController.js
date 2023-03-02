import { nanoid } from "nanoid";
import shortUrl from "../db/queries/urlQueries.js";

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
        console.log(error);
        return res.status(500).send('DB com problema');
      }
      return res.status(201).send({ id, shortUrl: identification });
    } catch (error) {
      return res.status(500).send('Problema no servidor');
    }
  }

export async function getShortUrlById (req, res) {
    const { id } = req.params;
    try {
      const { success, url, error } = await shortUrl.getById(id);
      if (!success) {
        console.log(error);
        res.status(500).send('DB com problema');
      }
      if (!url) res.sendStatus(404);
      return res.send(url);
    } catch (error) {
      console.log(error);
      res.status(500).send('Problema no servidor');
    }
  }

export async function redirectShortUrl (req, res) {
    const identification = req.params.shortUrl;
    try {
      const { success, url, error } = await shortUrl.getByShortUrl(identification);
      if (!success) {
        console.log(error);
        return res.status(500).send('DB com problema');
      }
      if (!url) return res.sendStatus(404);
      const { success: incrementSuccess, error: incrementError } = await shortUrl.incrementVisitsCountById(url.id);
      if (!incrementSuccess) {
        console.log(incrementError);
        return res.status(500).send('DB com problema');
      }
      return res.redirect(url.url);
    } catch (error) {
      return res.status(500).send('Problema no servidor!');
    }
  }

export async function deleteShortUrl (req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    try {
      const { success, url, error } = await shortUrl.getById(id);
      if (!success) {
        console.log(error);
        return res.status(500).send('DB com problema!');
      }
      if (!url) return res.sendStatus(404);
      console.log(url);
      if (url.userId !== userId) return res.sendStatus(401);
      const { success: deleteSuccess, error: deleteError } = await shortUrl.delete(id);
      if (!deleteSuccess) {
        console.log(deleteError);
        return res.status(500).send('DB com problema');
      }
      return res.sendStatus(204);
    } catch (error) {

    }
  }
