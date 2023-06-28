const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
};

module.exports.getUserById = (req, res) => {
  const _id = req.params.userId;
  User.findById({ _id })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
}

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' })) 
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка' }))
};