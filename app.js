const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const { StatusCodes } = require('./utils/StatusCodes');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.all('*', (req, res) => res.status(StatusCodes.NOT_FOUND).send({ message: 'Страницы по данному адресу не существует' }));

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
