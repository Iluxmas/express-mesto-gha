const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя пользователя должно быть от 2 до 30 символов'],
    maxlength: [30, 'Имя пользователя должно быть от 2 до 30 символов'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Описание пользователя должно быть от 2 до 30 символов'],
    maxlength: [30, 'Описание пользователя должно быть от 2 до 30 символов'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
