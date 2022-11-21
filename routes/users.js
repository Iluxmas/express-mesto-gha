const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { Patterns } = require('../utils/Patterns');
const {
  getUser,
  getAllUsers,
  updateUser,
  getMyInfo,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().pattern(Patterns.id).length(24),
  }),
}), getUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRouter.get('/me', getMyInfo);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(Patterns.url),
  }),
}), updateAvatar);

module.exports = userRouter;
