const jwt = require('jsonwebtoken');
const { StatusCodes } = require('../utils/StatusCodes');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.AUTH_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.split(' ')[1];
  let payload;

  try {
    payload = jwt.verify(token, 'iddqd_idkfa');
  } catch (err) {
    return res
      .status(StatusCodes.AUTH_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
  return null;
}

module.exports = auth;
