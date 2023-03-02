import users from "../config/queries/usersQueries.js";

export async function getUser (req, res) {
    const { userId } = res.locals;
    try {
      const { success, user, error } = await users.getById(userId);
      if (!success) {
        console.log(error);
        return res.status(500).send('DB com problema');
      }
      return res.send(user);
    } catch (error) {
      return res.status(500).send('Problema no servidor');
    }
  }

export async function getRanking (req, res) {
    try {
      const { success, ranking, error } = await users.rankingByVisits();
      if (!success) {
        console.log(error);
        return res.status(500).send('DB com problema');
      }
      return res.send(ranking);
    } catch (error) {
      return res.status(500).send('Problema no servidor');
    }
  }
