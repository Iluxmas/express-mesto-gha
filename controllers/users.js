const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { StatusCodes } = require('../utils/StatusCodes');

function createUser(req, res) {
  const {
    password, email, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 12)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then(() => {
      res.send({
        data: {
          email, name, about, avatar,
        },
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } if (error.code === 11000) {
        return res.status(StatusCodes.CONFLICT).send({ message: 'Пользователь с такой почтой уже зарегестрирован' });
      }
      return res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'При запросе переданы некорректные данные' });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function getMyInfo(req, res) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(StatusCodes.OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'При запросе переданы некорректные данные' });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function getAllUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      if (error.name === 'ObjectParameterError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные параметры запроса пользователей' });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function updateUser(req, res) {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, req.body, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователя с указанным id не найдено' });
        return;
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
}

function updateAvatar(req, res) {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, req.body, { new: true })
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователя с указанным id не найдено' });
        return;
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
}

function login(req, res) {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
        return;
      }

      bcrypt.compare(password, user.password, (error, data) => {
        if (error) {
          return res.status(StatusCodes.AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
        }
        if (data) {
          const token = jwt.sign({ _id: user._id }, 'iddqd_idkfa', { expiresIn: '7d' });
          res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
          return res.status(StatusCodes.OK).send({ message: 'Access granted' });
        }
        return res.status(StatusCodes.AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
}

module.exports = {
  createUser,
  getUser,
  getMyInfo,
  getAllUsers,
  updateUser,
  updateAvatar,
  login,
};
