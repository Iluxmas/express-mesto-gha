const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getAllCards);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/[a-z0-9]/).length(24),
  }),
}), deleteCard);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/^[a-z0-9]+$/).length(24),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/^[a-z0-9]+$/).length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
