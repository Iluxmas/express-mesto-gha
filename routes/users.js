const userRouter = require('express').Router();
const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', getUser);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;