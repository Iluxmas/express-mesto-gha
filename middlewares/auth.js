/* eslint-disable consistent-return */

const jwt = require('jsonwebtoken');
const Error401 = require('../errors/error401');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'iddqd_idkfa');
  } catch (err) {
    next(new Error401('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
}

module.exports = auth;
