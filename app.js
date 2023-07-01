const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const routes = require("./routes/index");

const { PORT, BASE_PATH, DATABASE } = require("./configuration");

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
app.use(routes);
app.use(errors()); // celebrate

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(`${BASE_PATH}:${PORT}`);
});
