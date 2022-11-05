const userRouter = require('express').Router();
const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', getUser);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
