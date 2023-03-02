import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const secretKey = process.env.JWT_SECRET
  
  try {
    const dados = jwt.verify(token, secretKey);
    res.locals.userId = dados;
    next();
  } catch {
    res.sendStatus(401)
  }
  // const verification = jwt.verify(token, secretKey, (error, coded) => {
  //   if (error) return res.status(401).send('Invalid Token');

  //   res.locals.userId = coded.userId;
  //   next();
  // });
};