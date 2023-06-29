const User = require('../models/user');
const mongoose = require('mongoose');

const {
  errorHandler,
  notFoundErrorThrow,
} = require('../utils/errorHandler');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => errorHandler(error, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => errorHandler(error, res));
};

module.exports.getUserById = (req, res) => {
  /*console.log(req.user._id);*/
  const _id = req.params.userId

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send({ message: 'Не верно указан формат ID пользователя' });
    return
  }
  User.findById({ _id })
    .then(user => {
      if (user) { res.send({ data: user }) } else { notFoundErrorThrow() }
    })
    .catch((error) => errorHandler(error, res));
}

module.exports.updateUserInfo = (req, res) => {
  const { name, about, avatar } = req.body;
  /*const _id = req.user._id;*/
  let data = {}
  name && (data = { ...data, name })
  about && (data = { ...data, about })
  if (Object.keys(data).length === 0 || !mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(400).send({ message: 'Переданы некорректные данные' })
    return
  }

  User.findByIdAndUpdate(req.user._id, { name, about, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((error) => errorHandler(error, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: 'Не правильно переданы данные' })
    return
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .then(user => {
      if (user) { res.send(user) } else { notFoundErrorThrow() }
    })
    .catch((error) => errorHandler(error, res));
};
