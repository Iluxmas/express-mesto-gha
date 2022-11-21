const Card = require('../models/card');
const { StatusCodes } = require('../utils/StatusCodes');

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function deleteCard(req, res) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      }
      if (card.owner.toString() !== req.user._id) {
        return res.status(StatusCodes.FORBIDDEN).send({ message: 'Только владелец может удалять свои карточки' });
      }
      card.remove();
      return res.status(StatusCodes.OK).send({ message: 'Карточка была удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные параметры для удаления карточки' });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function getAllCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      if (error.name === 'ObjectParameterError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные параметры запроса карточек' });
      } else {
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
}

function likeCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
}

function dislikeCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
}

module.exports = {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
};
