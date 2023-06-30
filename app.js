const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./utils/errorHandler');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

const PORT = process.env.PORT || 3000;
const BASE_PATH = process.env.BASE_PATH || 'https://localhost.ru';
const DATABASE = process.env.DATABASE || 'mongodb://127.0.0.1:27017/mestodb';

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { validateRegister, validateLogin } = require('./validate/userValidate');
const { NotFoundError } = require('./errors/NotFoundError');

// создаем приложение
const app = express();

// подключение к бд
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роуты
function notfoundHandler(req, res) {
  errorHandler({ name: 'NotFoundError' }, res);
}
app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);
app.use(auth);
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', notfoundHandler);
app.use(errors());  //celebrate

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`${BASE_PATH}:${PORT}`);
});