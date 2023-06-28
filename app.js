const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const BASE_PATH = process.env.BASE_PATH || 'https://localhost.ru';
const DATABASE = process.env.DATABASE || 'mongodb://127.0.0.1:27017/mestodb';

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

//создаем приложение
const app = express();

//подключение к бд
mongoose.connect(DATABASE, {
    useNewUrlParser: true
})
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//мидлвэр
app.use((req, res, next) => {
  req.user = {
    _id: '649bf521e3f5e98ddc5a6fb5' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
                                  //649bf521e3f5e98ddc5a6fb5
  next();
});

//роуты
app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT, () => {
    console.log('Ссылка на сервер');
    console.log(`${BASE_PATH}:${PORT}`);
});