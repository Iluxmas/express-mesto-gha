const User = require('../models/user');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: 'Произошла ошибка при создании пользователя, проверьте введенные данные',
        });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден catch' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
}

function getAllUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      if (error.name === 'ObjectParameterError') {
        res.status(400).send({ message: 'Переданы некорректные параметры запроса пользователей' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateUser(req, res) {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, ['awdada'], { new: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Пользователя с указанным id не найдено' });
        return;
      }
      if (error.name === 'MongooseError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(500).send({ message: error.message });
    });
}

function updateAvatar(req, res) {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, req.body, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Пользователя с указанным id не найдено' });
        return;
      }
      if (error.name === 'MongooseError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(400).send({ message: error.message });
    });
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  updateAvatar,
};
