const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
    userId: Joi.string().pattern(/^[a-z0-9]+$/).length(24),
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
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);

module.exports = userRouter;
