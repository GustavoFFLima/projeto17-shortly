import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  jwt.verify(token, 'SuperSecret', (err, decoded) => {
    if (err) return res.status(401).send('Invalid Token');

    res.locals.userId = decoded.userId;
    next();
  });
};