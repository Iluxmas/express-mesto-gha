const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.all('*', (req, res) => res.status(StatusCodes.NOT_FOUND).send({ message: 'Страницы по данному адресу не существует' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
