const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const { StatusCodes } = require('./utils/StatusCodes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6366192b5dbc692a534d7328',
  };

  next();
});
app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.all('*', (req, res) => res.status(StatusCodes.NOT_FOUND).send({ message: 'Страницы по данному адресу не существует' }));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
