/* eslint-disable consistent-return */

const jwt = require('jsonwebtoken');
const { StatusCodes } = require('../utils/StatusCodes');

function auth(req, res, next) {
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res
  //     .status(StatusCodes.AUTH_ERROR)
  //     .send({ message: 'Необходима авторизация' });
  // }

  const token = req.cookies.jwt;
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
}

module.exports = auth;
