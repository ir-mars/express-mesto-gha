const User = require("../models/user");

const SUCCES_ADDED_STATUS = 201;

const {
  errorHandler,
  notFoundErrorThrow,
  ERROR_BAD_REQUEST,
} = require("../utils/errorHandler");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => errorHandler(error, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCES_ADDED_STATUS).send(user))
    .catch((error) => errorHandler(error, res));
};

module.exports.getUserById = (req, res) => {
  const _id = req.params.userId;

  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        notFoundErrorThrow();
      }
    })
    .catch((error) => errorHandler(error, res));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about, avatar } = req.body;
  
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((error) => errorHandler(error, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res
      .status(ERROR_BAD_REQUEST)
      .send({ message: "Неправильно переданы данные" });
    return;
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        notFoundErrorThrow();
      }
    })
    .catch((error) => errorHandler(error, res));
};