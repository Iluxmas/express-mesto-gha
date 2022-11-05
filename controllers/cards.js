const Card = require('../models/card');

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner }, { runValidators: true })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Произошла ошибка при добавлении карточки, проверьте введенные данные' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Проверьте введенные данные' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
}

function getAllCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      if (error.name === 'ObjectParameterError') {
        res.status(400).send({ message: 'Переданы некорректные параметры запроса карточек' });
      } else {
        res.status(500).send({ message: error.message });
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
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(500).send({ message: error.message });
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
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(500).send({ message: error.message });
    });
}

module.exports = {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
};
