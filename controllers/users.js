const User = require('../models/user');
const { StatusCodes } = require('../utils/StatusCodes');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
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

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  updateAvatar,
};
