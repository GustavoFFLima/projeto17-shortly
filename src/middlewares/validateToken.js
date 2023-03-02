// import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
  // const token = req.headers.authorization?.replace('Bearer ', '');
  const { authorization: bearerToken } = req.headers
    
  const authToken = bearerToken.replace("Bearer ", "")
  console.log(authToken)
  if(!authToken) return res.status(401).send("token não informado");
  next();
  // const verification = jwt.verify(token, secretKey, (error, coded) => {
  //   if (error) return res.status(401).send('Invalid Token');

  //   res.locals.userId = coded.userId;
  //   next();
  // });
};