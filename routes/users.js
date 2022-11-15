const userRouter = require('express').Router();
const {
  getUser,
  getAllUsers,
  updateUser,
  getMyInfo,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', getUser);

userRouter.patch('/me', updateUser);

userRouter.get('/me', getMyInfo);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
